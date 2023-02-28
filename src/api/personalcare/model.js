import mongoose from "mongoose";

const { Schema, model } = mongoose;

const personalSchema = new Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  caregive: { type: String, require: true },
  givenby: { type: String, required: true },
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
  },
});

export default model("Personalcare", personalSchema);
