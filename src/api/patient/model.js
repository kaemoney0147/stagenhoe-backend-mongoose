import mongoose from "mongoose";
import FoodSchema from "../foodchart/model.js";
const { Schema, model } = mongoose;
const patientsSchema = new Schema(
  {
    title: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    image: { type: String, required: true },
    dob: { type: String, required: true },
    Age: { type: Number, required: true },
    Gender: { type: String, required: true },
    discription: { type: String, required: false },
    admission: {
      date: { type: String, required: true },
      time: { type: String, required: true },
    },
    ward: {
      type: String,
      required: true,
      enum: ["Codicote", "Benington", "Digswell"],
      default: "Codicote",
    },
    room: { type: String, required: true },
  },

  { timestamps: true }
);

export default model("Patient", patientsSchema);
