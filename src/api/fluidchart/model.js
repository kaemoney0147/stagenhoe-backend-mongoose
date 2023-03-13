import mongoose from "mongoose";

const { Schema, model } = mongoose;

const fluidSchema = new Schema({
  timeofday: {
    type: String,
    required: true,
    enum: ["Breakfast", "Lunch", "Dinner", "TeaTime", "MidMorning", "Midnight"],
  },
  date: { type: String, required: true },
  time: { type: String, required: true },
  type: { type: String, required: true },
  route: { type: String, required: true, enum: ["Peg", "Oral"] },
  amountofferd: { type: Number, required: true },
  amounttaken: { type: Number, required: true },
  running: { type: Number, required: true },
  output: { type: Number, required: false },
  givenby: { type: String, required: true },
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
  },
});

export default model("Fluid", fluidSchema);
