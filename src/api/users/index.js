import express from "express";
import createError from "http-errors";
import UserModel from "./model.js";
import { AdminOnlyMiddleware } from "../lib/auth/adminOnly.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import q2m from "query-to-mongo";
import createHttpError from "http-errors";
import { JWTAuthMiddleware } from "../lib/auth/jwtAuth.js";
import { createAccessToken } from "../lib/auth/tools.js";

const cloudinaryUpload = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "patient",
      format: "png",
    },
  }),
}).single("image");

const usersRouter = express.Router();

usersRouter.get(
  "/",
  JWTAuthMiddleware,
  // AdminOnlyMiddleware,

  async (req, res, next) => {
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
  }
);

usersRouter.post(
  "/register",
  AdminOnlyMiddleware,
  cloudinaryUpload,
  async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const existingUser = await UserModel.findOne({
        $or: [{ username }, { password }],
      });
      if (existingUser) {
        const existingField =
          existingUser.username === username ? "username" : "username";
        return res
          .status(400)
          .send({ message: `user with this ${existingField} already exists` });
      }

      const newUser = new UserModel(req.body);
      const savedUser = await newUser.save();

      res.status(201).send(savedUser);
    } catch (error) {
      next(error);
    }
  }
);

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

usersRouter.get(
  "/:id",
  JWTAuthMiddleware,
  AdminOnlyMiddleware,
  async (req, res, next) => {
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
  }
);

usersRouter.put("/:userId", AdminOnlyMiddleware, async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.userId);
    if (user) {
      const updated = await UserModel.findByIdAndUpdate(
        req.user.userId,
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
    const user = await UserModel.checkCredentials(username, password);

    if (user) {
      const payload = { _id: user._id, role: user.role };
      const accessToken = await createAccessToken(payload);
      res.send({ accessToken });
    } else {
      next(createError(401, "Wrong credentials!"));
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/admin", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.checkCredentials(username, password);

    if (user) {
      const payload = { _id: user._id, role: user.role };
      const accessToken = await createAccessToken(payload);
      res.send({ accessToken });
    } else {
      next(createError(401, "Wrong credentials!"));
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.delete("/:userId", AdminOnlyMiddleware, async (req, res, next) => {
  try {
    const userToDelete = await UserModel.findById(req.params.userId);
    if (userToDelete) {
      await UserModel.findByIdAndDelete(req.params.userId);
      res.status(205).send();
    } else {
      createHttpError(404, `User with id ${req.params.userId} is not found`);
    }
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
