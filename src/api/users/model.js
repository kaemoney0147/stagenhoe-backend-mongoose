import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const usersSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["Guest", "Admin"],
      default: "Guest",
      required: true,
    },
    avatar: { type: String, required: false },
  },
  { timestamps: true }
);

usersSchema.pre("save", async function (next) {
  const currentUser = this;
  if (currentUser.isModified("password")) {
    const plainPW = currentUser.password;
    const hash = await bcrypt.hash(plainPW, 10);
    currentUser.password = hash;
  }
  next();
});

usersSchema.methods.toJSON = function () {
  const userDocument = this;
  const user = userDocument.toObject();
  delete user.password;
  delete user.createdAt;
  delete user.updatedAt;
  delete user.__v;
  return user;
};

usersSchema.static("checkCredentials", async function (username, password) {
  const user = await this.findOne({ username });

  if (user) {
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      return user;
    } else {
      return null;
    }
  }
});

export default model("User", usersSchema);
