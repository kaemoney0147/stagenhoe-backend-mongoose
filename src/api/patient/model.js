import mongoose from "mongoose";
import FoodSchema from "../foodchart/model.js";
const { Schema, model } = mongoose;
const patientsSchema = new Schema(
  {
    title: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    image: { type: String, required: false },
    dob: { type: String, required: true },
    age: { type: Number, required: false },
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
    disease: { type: String, required: false },
    room: { type: Number, required: true },
  },

  { timestamps: true }
);

export default model("Patient", patientsSchema);
