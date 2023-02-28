import mongoose from "mongoose";

const { Schema, model } = mongoose;
const foodSchema = new Schema({
  timeofday: {
    type: String,
    required: true,
    enum: ["Breakfast", "Lunch", "Dinner"],
  },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  offered: { type: String, required: true },
  amountoffered: { type: String, required: true },
  amountaccepted: { type: String, required: true },
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
  },
  givenby: { type: String, required: true },
});

export default model("Foodchart", foodSchema);
