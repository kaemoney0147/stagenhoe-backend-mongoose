import mongoose from "mongoose";

const { Schema, model } = mongoose;

const respSchema = new Schema({
  time: { type: String, required: true },
  date: { type: String, required: true },
  position: { type: String, requried: true, enum: ["Back", "Left", "Right"] },
  comment: { type: String, required: false },
  signatures: { type: String, required: true },
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
  },
});

export default model("Reposition", respSchema);
