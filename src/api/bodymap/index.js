import express from "express";
import BodyMapModel from "../Bodymap/model.js";

const bodyMapRouter = express.Router();

bodyMapRouter.post("/:patientId", async (req, res, next) => {
  try {
    if (req.file === undefined) {
      const newPost = new BodyMapModel({
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
bodyMapRouter.get("/", async (req, res, next) => {
  try {
    const foodchart = await BodyMapModel.find(req.body);
    res.send(foodchart);
  } catch (error) {
    next();
  }
});
bodyMapRouter.get("/:bodymapId", async (req, res, next) => {
  try {
    const post = await BodyMapModel.findById(req.params.bodymapId).populate({
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

bodyMapRouter.get("/patient/:patientId", async (req, res, next) => {
  try {
    const posts = await BodyMapModel.find({
      patient: req.params.patientId,
    });
    if (posts) {
      res.send(posts);
    }
  } catch (err) {
    next(err);
  }
});

export default bodyMapRouter;
