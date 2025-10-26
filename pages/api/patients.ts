// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { IPatient } from "@/lib/interfaces";
import { connectToDatabase } from "@/lib/dbConnection";
import Patients from "@/lib/patient.schema";
import type { NextApiRequest, NextApiResponse } from "next";

interface PatientResult {
  patients?: Array<IPatient> | IPatient;
  message?: string;
  error?: unknown;
}

const PET_TYPES = ["Dog", "Cat", "Parrot", "Other"];

const calculatePetAge = (rawBirthDate?: string | Date | null) => {
  if (!rawBirthDate) return undefined;
  const birthDate = typeof rawBirthDate === "string" ? new Date(rawBirthDate) : rawBirthDate;
  if (isNaN(birthDate.getTime())) return undefined;

  const now = new Date();
  let years = now.getUTCFullYear() - birthDate.getUTCFullYear();
  const monthDiff = now.getUTCMonth() - birthDate.getUTCMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getUTCDate() < birthDate.getUTCDate())) {
    years--;
  }
  return Math.max(0, years);
};

const toPatientResponse = (doc: any) => {
  const obj = doc.toObject();
  const derivedAge = calculatePetAge(obj.birthDate);
  if (derivedAge !== undefined) {
    obj.petAge = derivedAge;
  }
  return obj;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PatientResult>
) {
  await connectToDatabase();

  if (req.method === "POST") {
    return await create(req, res);
  }
  if (req.method === "PUT") {
    return await update(req, res);
  }
  if (req.method === "GET") {
    return await read(req, res);
  }
  if (req.method === "DELETE") {
    return await del(req, res);
  }
}

const create = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const patientData = req.body as Partial<IPatient>;

    const requiredFields: Array<keyof IPatient> = ["name", "phone", "petName", "petType", "birthDate"];

    for (const field of requiredFields) {
      if (patientData[field] === undefined || patientData[field] === null || patientData[field] === "") {
        return res.status(400).json({ message: `Missing required field: ${String(field)}` });
      }
    }

    // Validate petType
    if (!PET_TYPES.includes(String(patientData.petType))) {
      return res.status(400).json({ message: "Invalid pet type" });
    }

    // Validate birthDate is not in the future
    const bd = new Date(String(patientData.birthDate));
    if (isNaN(bd.getTime()) || bd.getTime() > Date.now()) {
      return res.status(400).json({ message: "Birth date cannot be in the future" });
    }

    const { petAge: _unused, ...sanitizedPatient } = patientData;

    const newPatient = new Patients({
      ...sanitizedPatient,
      birthDate: bd,
    });
    await newPatient.save();

    res.status(201).json({ patients: toPatientResponse(newPatient) });
  } catch (error) {
    res.status(500).json({ error, message: "Failed to create patient" });
  }
};

const read = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const patients = await Patients.find();
    const mapped = patients.map((patient: any) => toPatientResponse(patient));
    res.status(200).json({ patients: mapped });
  } catch (error) {
    res.status(500).json({ error, message: "Failed to load patients" });
  }
};

const update = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query as { id: string };
    
    if (!id) {
      return res.status(400).json({ message: "Missing patient ID" });
    }

    const updates: Record<string, any> = { ...req.body };

    // If updating birthDate, validate not future
    if (updates.birthDate) {
      const bd = new Date(String(updates.birthDate));
      if (isNaN(bd.getTime()) || bd.getTime() > Date.now()) {
        return res.status(400).json({ message: "Birth date cannot be in the future" });
      }
      updates.birthDate = bd;
    }

    if (updates.petAge !== undefined) {
      delete updates.petAge;
    }

    if (updates.petType && !PET_TYPES.includes(String(updates.petType))) {
      return res.status(400).json({ message: "Invalid pet type" });
    }

    const updatedPatient = await Patients.findByIdAndUpdate(id, updates, { new: true }).exec();
    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({ patients: toPatientResponse(updatedPatient) });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ error, message: "Failed to update patient" });
  }
}

const del = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query as { id: string };

    if (!id) {
      return res.status(400).json({ message: "Missing patient ID" });
    }

    const deletedPatient = await Patients.findByIdAndDelete(id).exec();
    if (!deletedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({ patients: toPatientResponse(deletedPatient) });
  } catch (error) {
    res.status(500).json({ error, message: "Failed to delete patient" });
  }
}
