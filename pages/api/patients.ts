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
    const patientData: IPatient = req.body;

    const requiredFields: Array<keyof IPatient> = ['name', 'phone', 'petName', 'petType', 'petAge'];

    for (const field of requiredFields) {
      if (patientData[field] === undefined || patientData[field] === null) {
        return res.status(400).json({ message: `Missing required field: ${field}` });
      }
    }

    const newPatient = new Patients(patientData);
    await newPatient.save();
    res.status(201).json({ pateints: newPatient });
  } catch (error) {
    res.status(500).json({ error, message: "Failed to create patient" });
  }
};

const read = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const patients = await Patients.find();
    res.status(200).json({ patients });
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

    const updatedPatient: IPatient = await Patients.findByIdAndUpdate(id, req.body, { new: true }).exec();
    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const petType = ['Dog', 'Cat', 'Parrot', 'Other'];

    if (!petType.includes(updatedPatient.petType)) {
      return res.status(400).json({ message: "Invalid pet type" });
    }
    
    res.status(200).json({ pateints: updatedPatient });
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
