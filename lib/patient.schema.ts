import mongoose, { Schema, models } from "mongoose";

const patientSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  petName: { type: String, required: true },
  petType: { type: String, required: true },
  petAge: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default models.Patient || mongoose.model("Patient", patientSchema);
