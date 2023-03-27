import createHttpError from "http-errors";

export const AdminOnlyMiddleware = (req, res, next) => {
  console.log("this is me here", req.user);
  if (req.user.role === "Admin") {
    next();
  } else {
    next(createHttpError(403, "Admin only endpoint!"));
  }
};
