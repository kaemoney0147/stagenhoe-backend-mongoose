import mongoose from "mongoose";

const { Schema, model } = mongoose;
const foodSchema = new Schema({
  timeofday: {
    type: String,
    required: true,
    enum: ["Breakfast", "Lunch", "Dinner"],
    default: "Breakfast",
  },
  date: { type: String, required: true },
  time: { type: String, required: true },
  amountoffered: { type: String, required: true },
  amountaccepted: { type: String, required: true },
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
  },
  givenby: { type: String, required: true },
});

export default model("Foodchart", foodSchema);
