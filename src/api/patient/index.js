import express from "express";
import PatientModel from "../patient/model.js";
import queryString from "mongoose";
const patientRouter = express.Router();

patientRouter.post("/", async (req, res, next) => {
  try {
    const newPatient = new PatientModel({
      ...req.body,
      foodChart: req.params.foodchartId,
    });
    const { _id } = await newPatient.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});
patientRouter.get("/", async (req, res, next) => {
  try {
    let query = {};
    if (req.query.ward || req.query.firstName) {
      query = {
        $or: [{ ward: req.query.ward }, { firstName: req.query.firstName }],
      };
    }
    const patients = await PatientModel.find(query);
    res.send(patients);
  } catch (error) {
    next(error);
  }
});

patientRouter.get("/:patientId", async (req, res, next) => {
  try {
    const patient = await PatientModel.findById(req.params.patientId);
    if (patient) {
      res.send(patient);
    }
  } catch (error) {
    next(error);
  }
});
patientRouter.put("/:patientId", async (req, res, next) => {
  try {
    const updatedPatient = await PatientModel.findByIdAndUpdate(
      req.params.patientId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedPatient) {
      res.send(updatedPatient);
    } else {
      console.log("error happens");
    }
  } catch (error) {
    next(error);
  }
});
patientRouter.delete("/:patientId", async (req, res, next) => {
  try {
    const deletedPatient = PatientModel.findByIdAndDelete(req.params.patientId);
    if (deletedPatient) {
      res.status(204).send();
    }
  } catch (error) {
    next(error);
  }
});

export default patientRouter;
