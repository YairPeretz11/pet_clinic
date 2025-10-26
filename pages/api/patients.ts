// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { IPatient } from "@/lib/interfaces";
import { connectToDatabase } from "@/lib/dbConnection";
import Patients from "@/lib/patient.schema";
import type { NextApiRequest, NextApiResponse } from "next";

interface PatientResult {
  pateints?: Array<IPatient> | IPatient;
}

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

    const requiredFields: Array<keyof IPatient> = ['name', 'phone', 'petName', 'petType', 'birthDate'];

    for (const field of requiredFields) {
      if (patientData[field] === undefined || patientData[field] === null || patientData[field] === "") {
        return res.status(400).json({ message: `Missing required field: ${String(field)}` });
      }
    }

    // Validate petType
    const petTypes = ['Dog', 'Cat', 'Parrot', 'Other'];
    if (!petTypes.includes(String(patientData.petType))) {
      return res.status(400).json({ message: "Invalid pet type" });
    }

    // Validate birthDate is not in the future
    const bd = new Date(String(patientData.birthDate));
    if (isNaN(bd.getTime()) || bd.getTime() > Date.now()) {
      return res.status(400).json({ message: "Birth date cannot be in the future" });
    }

    const newPatient = new Patients(patientData);
    await newPatient.save();

    // Compute derived age for response
    const obj = newPatient.toObject();
    const age = Math.max(0, new Date(Date.now()).getUTCFullYear() - new Date(obj.birthDate).getUTCFullYear() - (new Date().setMonth(0,1) < new Date(obj.birthDate).setMonth(0,1) ? 1 : 0));
    (obj as any).petAge = age;

    res.status(201).json({ pateints: obj });
  } catch (error) {
    res.status(500).json({ error, message: "Failed to create patient" });
  }
};

const read = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const patients = await Patients.find();
    // Map to include derived petAge from birthDate
    const mapped = patients.map((p: any) => {
      const obj = p.toObject();
      const bd = obj.birthDate ? new Date(obj.birthDate) : undefined;
      if (bd && !isNaN(bd.getTime())) {
        const now = new Date();
        let age = now.getUTCFullYear() - bd.getUTCFullYear();
        const m = now.getUTCMonth() - bd.getUTCMonth();
        if (m < 0 || (m === 0 && now.getUTCDate() < bd.getUTCDate())) age--;
        obj.petAge = Math.max(0, age);
      }
      return obj;
    });
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

    // If updating birthDate, validate not future
    if (req.body && req.body.birthDate) {
      const bd = new Date(String(req.body.birthDate));
      if (isNaN(bd.getTime()) || bd.getTime() > Date.now()) {
        return res.status(400).json({ message: "Birth date cannot be in the future" });
      }
    }

    const updatedPatient = await Patients.findByIdAndUpdate(id, req.body, { new: true }).exec();
    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const petType = ['Dog', 'Cat', 'Parrot', 'Other'];

    if (!petType.includes(updatedPatient.petType)) {
      return res.status(400).json({ message: "Invalid pet type" });
    }

    const obj = updatedPatient.toObject();
    const bd = obj.birthDate ? new Date(obj.birthDate) : undefined;
    if (bd && !isNaN(bd.getTime())) {
      const now = new Date();
      let age = now.getUTCFullYear() - bd.getUTCFullYear();
      const m = now.getUTCMonth() - bd.getUTCMonth();
      if (m < 0 || (m === 0 && now.getUTCDate() < bd.getUTCDate())) age--;
      obj.petAge = Math.max(0, age);
    }

    res.status(200).json({ pateints: obj });
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

    res.status(200).json({ pateints: deletedPatient });
  } catch (error) {
    res.status(500).json({ error, message: "Failed to delete patient" });
  }
}
