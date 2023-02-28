import mongoose from "mongoose";

const { Schema, model } = mongoose;

const bowelSchema = new Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  amount: { type: String, required: true, enum: ["Small", "Medium", "Large"] },
  type: {
    type: String,
    required: true,
    enum: ["Type1", "Type2", "Type3", "Type4", "Type5", "Type6", "Type7"],
  },
  intervention: { type: String, required: false },
  signature: { type: String, required: false },
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
  },
});

export default model("Bowel", bowelSchema);
