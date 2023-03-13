import express from "express";
import RespModel from "../reposition/model.js";

const respRouter = express.Router();

respRouter.post("/:patientId/resp", async (req, res, next) => {
  try {
    if (req.file === undefined) {
      const newResp = new RespModel({
        ...req.body,
        patient: req.params.patientId,
      });
      const { _id } = await newResp.save();
      res.status(201).send({ _id });
    } else {
      const newResp = new postsModel({
        ...req.body,
        patient: req.params.patientId,
      });
      const { _id } = await newResp.save();
      res.status(201).send({ _id });
    }
  } catch (err) {
    next(err);
  }
});
respRouter.get("/", async (req, res, next) => {
  try {
    const newResp = await RespModel.find(req.body);
    res.send(newResp);
  } catch (error) {
    next();
  }
});
respRouter.get("/:respId", async (req, res, next) => {
  try {
    const newResp = await RespModel.findById(req.params.respId);
    if (newResp) {
      res.send(newResp);
    } else {
      next("error");
    }
  } catch (err) {
    next(err);
  }
});

respRouter.get("/patient/:patientId", async (req, res, next) => {
  try {
    const newResp = await RespModel.find({
      patient: req.params.patientId,
    });
    if (newResp) {
      res.send(newResp);
    }
  } catch (err) {
    next(err);
  }
});

export default respRouter;
