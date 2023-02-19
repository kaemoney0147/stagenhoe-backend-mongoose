import mongoose from "mongoose";

const { Schema, model } = mongoose;
const foodSchema = new Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  amountoffered: { type: String, required: true },
  amountaccepted: { type: String, required: true },
  givenby: { type: String, required: true },
});

export default foodSchema;
