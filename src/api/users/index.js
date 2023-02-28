import express from "express";
import createError from "http-errors";
import UserModel from "./model.js";
import multer from "multer";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import { v2 as cloudinary } from "cloudinary";
import q2m from "query-to-mongo";
import { JWTAuthMiddleware } from "../lib/auth/jwtAuth.js";
import passport from "passport";
import { createAccessToken } from "../lib/auth/tools.js";

// const cloudinaryUpload = multer({
//   storage: new CloudinaryStorage({
//     cloudinary,
//     params: {
//       folder: "database",
//       format: "png"
//     }
//   })
// }).single("avatar");

const usersRouter = express.Router();

usersRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const query = q2m(req.query);
    const total = await UserModel.countDocuments(query.criteria);
    const users = await UserModel.find(query.criteria, query.options.fields)
      .skip(query.options.skip)
      .limit(query.options.limit)
      .sort(query.options.sort);
    res.send({ links: query.links("/users", total), total, users });
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const existingUser = await UserModel.findOne({
      $or: [{ username }, { username }],
    });

    if (existingUser) {
      return res.status(400).send({ error: "username already in use" });
    }
    const newUser = new UserModel({
      username,
      password,
    });
    const { _id } = await newUser.save();
    const payload = { _id: newUser._id };
    const accessToken = await createAccessToken(payload);
    res.status(201).send({ _id: newUser._id, accessToken });
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    console.log(req.user);
    const user = await UserModel.findById(req.user._id);
    if (user) {
      res.send(user);
    } else {
      next(createError(404, `User with id ${req.user._id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      next(createError(404, `User with id ${req.params.id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.put("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id);
    if (user) {
      const updated = await UserModel.findByIdAndUpdate(
        req.user._id,
        req.body,
        {
          runValidators: true,
          new: true,
        }
      );
      res.send(updated);
    } else {
      next(createError(404, `User with id ${req.user._id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findByCredentials(username, password);

    if (user) {
      const payload = { _id: user._id };
      const accessToken = await createAccessToken(payload);
      res.send({ accessToken });
    } else {
      next(createError(401, "Wrong credentials!"));
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.delete("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id);
    if (user) {
      res.status(204).send();
    } else {
      next(createError(404, `User with id ${req.user._id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
