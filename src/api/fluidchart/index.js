import express from "express";
import FluidModel from "../fluidchart/model.js";

const fluidRouter = express.Router();

fluidRouter.post("/:patientId", async (req, res, next) => {
  try {
    if (req.file === undefined) {
      const newPost = new FluidModel({
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
fluidRouter.get("/", async (req, res, next) => {
  try {
    const foodchart = await FluidModel.find(req.body);
    res.send(foodchart);
  } catch (error) {
    next();
  }
});
fluidRouter.get("/:fluidtId", async (req, res, next) => {
  try {
    const post = await FluidModel.findById(req.params.fluidtId).populate({
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

fluidRouter.get("/patient/:patientId", async (req, res, next) => {
  try {
    const posts = await FluidModel.find({
      patient: req.params.patientId,
    });
    // const { running, amounttaken } = posts[0];
    // console.log("here i am", amounttaken);
    if (posts) {
      res.send(posts);
    }
  } catch (err) {
    next(err);
  }
});

export default fluidRouter;
