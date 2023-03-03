import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import patientRouter from "./api/patient/index.js";
import foodRouter from "./api/foodchart/index.js";
import personcareRouter from "./api/personalcare/index.js";
import fluidRouter from "./api/fluidchart/index.js";
import usersRouter from "./api/users/index.js";
import bowelRouter from "./api/bowelchart/index.js";
import vitalRouter from "./api/vitalexamination/index.js";
const server = express();
const port = process.env.PORT || 3001;

//......................Middleware..................
server.use(cors());
server.use(express.json());

//...........................Endpoint.....................
server.use("/patient", patientRouter);
server.use("/foodchart", foodRouter);
server.use("/personalcare", personcareRouter);
server.use("/fluid", fluidRouter);
server.use("/users", usersRouter);
server.use("/bowel", bowelRouter);
server.use("/vital", vitalRouter);
//................... Errorhandlers......................

mongoose.connect(process.env.MONGOOSE_URL);

mongoose.connection.on("connected", () => {
  console.log("succuessfuly connect to mongodb");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log("server currently running", port);
  });
});
