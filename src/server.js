import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import patientRouter from "./api/patient/index.js";

const server = express();
const port = process.env.PORT || 3001;

//......................Middleware..................
server.use(cors());
server.use(express.json());

//...........................Endpoint.....................
server.use("/patient", patientRouter);

//................... Errorhandlers......................

mongoose.connect(process.env.MONGOOSE_URL);

mongoose.connection.on("connected", () => {
  console.log("succuessfuly connect to mongodb");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log("server currently running", port);
  });
});
