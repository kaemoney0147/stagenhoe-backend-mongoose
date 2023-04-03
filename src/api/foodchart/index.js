import express from "express";
import FoodchartModel from "../foodchart/model.js";

const foodRouter = express.Router();

foodRouter.post("/:patientId", async (req, res, next) => {
  try {
    if (req.file === undefined) {
      const newPost = new FoodchartModel({
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
foodRouter.get("/", async (req, res, next) => {
  try {
    const foodchart = await FoodchartModel.find().populate({
      path: "patient",
      select: "firstName title lastName ward",
    });
    res.send(foodchart);
  } catch (error) {
    next();
  }
});
foodRouter.get("/:foodchartId", async (req, res, next) => {
  try {
    const post = await FoodchartModel.findById(req.params.foodchartId).populate(
      {
        path: "patient",
      }
    );
    if (post) {
      res.send(post);
    } else {
      next("error");
    }
  } catch (err) {
    next(err);
  }
});

foodRouter.get("/patient/:patientId", async (req, res, next) => {
  try {
    const posts = await FoodchartModel.find({
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

foodRouter.delete("/:foodchartId/delete", async (req, res, next) => {
  try {
    const deletedPatient = await FoodchartModel.findByIdAndDelete(
      req.params.foodchartId
    );
    if (deletedPatient) {
      res.status(204).send("this patient fluid deleted sucessfully");
    }
  } catch (error) {
    next(error);
  }
});

export default foodRouter;
