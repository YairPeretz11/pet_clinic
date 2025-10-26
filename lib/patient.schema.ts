import mongoose, { Schema, models } from "mongoose";

const patientSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  petName: { type: String, required: true },
  petType: { type: String, required: true },
  // Store birthDate as the source of truth
  birthDate: { type: Date, required: true },
  // petAge kept for backward compatibility but not required
  petAge: { type: Number, required: false },
  createdAt: { type: Date, default: Date.now },
});

export default models.Patient || mongoose.model("Patient", patientSchema);
