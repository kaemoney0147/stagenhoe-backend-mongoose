import mongoose from "mongoose";

const { Schema, model } = mongoose;

const vitalSchema = new Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  respiration: { type: String, required: true },
  bloodpressure: { type: String, required: true },
  pulse: { type: String, required: true },
  temparature: { type: String, required: true },
  breathing: { type: String, required: true, enum: ["Air", "Oxygen"] },
  consciousness: {
    type: String,
    required: false,
    enum: ["Alert", "Confusion"],
  },
  scale1: { type: String, required: true },
  scale2: { type: String, required: false },
  signature: { type: String, required: true },
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
  },
});

export default model("Vital", vitalSchema);
