import express from "express";
import PatientModel from "../patient/model.js";

const patientRouter = express.Router();

patientRouter.post("/", async (req, res, next) => {
  try {
    const newPatient = new PatientModel(req.body);
    const { _id } = await newPatient.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});
patientRouter.get("/", async (req, res, next) => {
  try {
    const patient = await PatientModel.find(req.body);
    res.send(patient);
  } catch (error) {
    next(error);
  }
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
patientRouter.delete("/:patientId", async (req, res, next) => {
  try {
    const deletedPatient = PatientModel.findByIdAndDelete(req.params.patientId);
    if (deletedPatient) {
      res.status(204).send();
    }
  } catch (error) {
    next(error);
  }
});

//............................embending food for patient...........
patientRouter.post("/:patientId/foodchart", async (req, res, next) => {
  try {
    const foodChart = req.body; // Get the review from the req.body

    if (foodChart) {
      const foodToInsert = foodChart;
      const updatedPatient = await PatientModel.findByIdAndUpdate(
        req.params.patientId, // WHO
        { $push: { foodChart: foodToInsert } }, // HOW
        { new: true, runValidators: true } // OPTIONS
      );

      if (updatedPatient) {
        res.send(updatedPatient);
      } else {
        next(
          createHttpError(
            404,
            `Patient with id ${req.params.patientId} not found!`
          )
        );
      }
    } else {
      // 4. In case of either book not found or product not found --> 404
      // next(createHttpError(404, `Review not found!`));
    }
  } catch (error) {
    next(error);
  }
});

patientRouter.get("/:patientId/foodchart", async (req, res, next) => {
  try {
    const patient = await PatientModel.findById(req.params.patientId);
    if (patient) {
      if (patient.foodChart.length === 0) {
        res.send("No foodcahrt found for this patient.");
      } else {
        res.send(patient.foodChart);
      }
    } else {
      // next(
      //   createHttpError(
      //     404,
      //     `Product with id ${req.params.patientId} not found!`
      //   )
      // );
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});
patientRouter.get(
  "/:patientId/foodchart/:foodchartId",
  async (req, res, next) => {
    try {
      const patient = await PatientModel.findById(req.params.patientId);
      if (patient) {
        const selectedReview = patient.foodChart.find(
          (food) => food._id.toString() === req.params.foodchartId
        );

        if (selectedReview) {
          res.send(selectedReview);
        } else {
          // next(createHttpError(404, `Review with id ${req.params.reviewId} not found!`))
        }
      } else {
        // next(createHttpError(404, `Product with id ${req.params.productId} not found!`))
      }
    } catch (error) {
      next(error);
    }
  }
);

export default patientRouter;
