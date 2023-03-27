import express from "express";
import PatientModel from "../patient/model.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
const patientRouter = express.Router();

const cloudinaryUpload = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "sueryder/patient",
    },
  }),
}).single("image");

patientRouter.post("/", async (req, res, next) => {
  try {
    const newPatient = new PatientModel({
      ...req.body,
      foodChart: req.params.foodchartId,
    });
    const { _id } = await newPatient.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

patientRouter.post(
  "/:patientId/upload",
  cloudinaryUpload,
  async (req, res, next) => {
    const { patientId } = req.params;
    const url = req.file.path;
    console.log("this is url", req.file);
    try {
      const updatedPatient = await PatientModel.findByIdAndUpdate(
        patientId,
        { image: url },
        { new: true, runValidators: true }
      );
      if (updatedPatient) {
        res
          .status(201)
          .send({ message: `this patient image as successfuly updated` });
      }
    } catch (error) {
      next(error);
    }
  }
);

patientRouter.get("/", async (req, res, next) => {
  let { ward, firstName } = req.query;
  let query = {};

  try {
    if (ward || firstName) {
      ward = ward ? ward.toLowerCase() : ward;
      firstName = firstName ? firstName.toLowerCase() : firstName;

      query = {
        $or: [
          { ward: { $regex: new RegExp("^" + ward, "i") } },
          { firstName: { $regex: new RegExp("^" + firstName, "i") } },
        ],
      };
    }

    const patients = await PatientModel.find(query);
    res.send(patients);
  } catch (error) {
    next(error);
  }
});

patientRouter.get("/chart", async (req, res, next) => {
  try {
    const admissionSummary = await PatientModel.aggregate([
      {
        $group: {
          _id: {
            year: { $year: { $toDate: "$admission.date" } },
            month: { $month: { $toDate: "$admission.date" } },
          },
          numberOfPatients: {
            $sum: 1,
          },
        },
      },
    ]);
    res.send(admissionSummary);
  } catch (error) {}
});

patientRouter.get("/:patientId", async (req, res, next) => {
  try {
    const patient = await PatientModel.findById(req.params.patientId);
    if (patient) {
      res.send(patient);
    }
  } catch (error) {
    next(error);
  }
});
patientRouter.put("/:patientId", async (req, res, next) => {
  try {
    const updatedPatient = await PatientModel.findByIdAndUpdate(
      req.params.patientId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedPatient) {
      res.send(updatedPatient);
    } else {
      console.log("error happens");
    }
  } catch (error) {
    next(error);
  }
});
patientRouter.delete("/:patientId/delete", async (req, res, next) => {
  try {
    const deletedPatient = await PatientModel.findByIdAndDelete(
      req.params.patientId
    );
    if (deletedPatient) {
      res.status(204).send("this patient as being deleted sucessfully");
    }
  } catch (error) {
    next(error);
  }
});

export default patientRouter;
