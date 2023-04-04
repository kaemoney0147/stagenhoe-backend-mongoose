import express from "express";
import BowelModel from "../bowelchart/model.js";

const bowelRouter = express.Router();

bowelRouter.post("/:patientId", async (req, res, next) => {
  try {
    if (req.file === undefined) {
      const newPost = new BowelModel({
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
bowelRouter.get("/", async (req, res, next) => {
  try {
    const foodchart = await BowelModel.find(req.body);
    res.send(foodchart);
  } catch (error) {
    next();
  }
});
bowelRouter.get("/:bowelId", async (req, res, next) => {
  try {
    const post = await BowelModel.findById(req.params.bowelId);
    if (post) {
      res.send(post);
    } else {
      next("error");
    }
  } catch (err) {
    next(err);
  }
});

bowelRouter.get("/patient/:patientId", async (req, res, next) => {
  try {
    const posts = await BowelModel.find({
      patient: req.params.patientId,
    }).populate({
      path: "patient",
    });
    if (posts) {
      res.send(posts);
    }
  } catch (err) {
    next(err);
  }
});

bowelRouter.delete("/:bowelId/delete", async (req, res, next) => {
  try {
    const deletedPatient = await BowelModel.findByIdAndDelete(
      req.params.bowelId
    );
    if (deletedPatient) {
      res.status(204).send("this patient  bowel sucessfully deleted");
    }
  } catch (error) {
    next(error);
  }
});

export default bowelRouter;
