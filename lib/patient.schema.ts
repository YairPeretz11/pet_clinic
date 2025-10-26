import mongoose, { Schema } from "mongoose";

const patientSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  petName: { type: String, required: true },
  petType: { type: String, required: true },
  birthDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

const MODEL_NAME = "Patient";

if (process.env.NODE_ENV === "development" && mongoose.models[MODEL_NAME]) {
  delete mongoose.models[MODEL_NAME];
}

export default mongoose.models[MODEL_NAME] || mongoose.model(MODEL_NAME, patientSchema);
