import express from "express";
import PersonalcareModal from "../personalcare/model.js";

const personcareRouter = express.Router();

personcareRouter.post("/:patientId", async (req, res, next) => {
  try {
    if (req.file === undefined) {
      const newPost = new PersonalcareModal({
        ...req.body,
        patient: req.params.patientId,
      });
      const { _id } = await newPost.save();
      res.status(201).send({ _id });
    } else {
      const newPost = new postsModel({
        ...req.body,
        patient: req.params.patientId,
      });
      const { _id } = await newPost.save();
      res.status(201).send({ _id });
    }
  } catch (err) {
    next(err);
  }
});
personcareRouter.get("/", async (req, res, next) => {
  try {
    const newPost = await PersonalcareModal.find(req.body);
    res.send(newPost);
  } catch (error) {
    next();
  }
});
personcareRouter.get("/:personalId", async (req, res, next) => {
  try {
    const newPost = await PersonalcareModal.findById(
      req.params.personalId
    ).populate({
      path: "patient",
    });
    if (newPost) {
      res.send(newPost);
    } else {
      next("error");
    }
  } catch (err) {
    next(err);
  }
});

personcareRouter.get("/patient/:patientId", async (req, res, next) => {
  try {
    const newPost = await PersonalcareModal.find({
      patient: req.params.patientId,
    }).populate({
      path: "patient",
      select: "firstName lastName Age image room ward",
    });
    if (newPost) {
      res.send(newPost);
    }
  } catch (err) {
    next(err);
  }
});

export default personcareRouter;
