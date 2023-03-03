import express from "express";
import VitalModel from "../vitalexamination/modal.js";

const vitalRouter = express.Router();

vitalRouter.post("/:patientId", async (req, res, next) => {
  try {
    const newvital = new VitalModel({
      ...req.body,
      patient: req.params.patientId,
    });
    const { _id } = await newvital.save();
    res.status(201).send({ _id });
  } catch (error) {
    next("error");
  }
});

vitalRouter.get("/", async (req, res, next) => {
  try {
    const vital = await VitalModel(req.body);
    res.send(vital);
  } catch (error) {}
});

vitalRouter.get("/:vitalId", async (req, res, next) => {
  try {
    const post = await VitalModel.findById(req.params.vitalId).populate({
      path: "patient",
    });
    if (post) {
      res.send(post);
    } else {
      next("error");
    }
  } catch (err) {
    next(err);
  }
});

vitalRouter.get("/patient/:patientId", async (req, res, next) => {
  try {
    const vital = await VitalModel.find({
      patient: req.params.patientId,
    }).populate({
      path: "patient",
    });
    if (vital) {
      res.send(vital);
    }
  } catch (err) {
    next(err);
  }
});
export default vitalRouter;
