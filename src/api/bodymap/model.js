import mongoose from "mongoose";

const { Schema, model } = mongoose;

const bodyMapSchema = new Schema({
  time: { type: String, required: true },
  date: { type: String, required: true },
  front: { type: String, requried: false, enum: ["Left", "Right", "None"] },
  back: { type: String, requried: false, enum: ["Left", "Right", "None"] },
  review: { type: String, required: true },
  signatures: { type: String, required: true },
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
  },
});

export default model("Bodymap", bodyMapSchema);
