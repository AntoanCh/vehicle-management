import express from "express";
import { Problem } from "../models/ProblemModel.js";

const router = express.Router();

//Route for saving a new Problem
router.post("/", async (req, res) => {
  try {
    if (
      !req.body.date ||
      !req.body.desc ||
      !req.body.vehicleId ||
      !req.body.driverName
    ) {
      return res.status(400).send({
        message: "Изпратете всички невобходими полета",
      });
    }
    const newProblem = {
      date: req.body.date,
      desc: req.body.desc,
      driverName: req.body.driverName,
      km: req.body.km,
      vehicleId: req.body.vehicleId,
      driverId: req.body.driverId,
    };
    const problem = await Problem.create(newProblem);
    return res.status(201).send(problem);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route to get all problems
router.get("/", async (req, res) => {
  try {
    const problems = await Problem.find({});
    return res.status(200).json({
      count: problems.length,
      data: problems,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route to get All Problems for a specific Asset
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // const vehicle = req.body.vehicleId;
    const problems = await Problem.find({ vehicleId: id });
    return res.status(200).json({
      count: problems.length,
      data: problems,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});
//Route for Get One Problem from database by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await Problem.findById(id);

    return res.status(200).json(fuel);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route for Update a Problem
router.put("/:id", async (req, res) => {
  try {
    if (!req.body.date || !req.body.desc || !req.body.vehicleId) {
      return res.status(400).send({
        message: "Изпратете всички невобходими полета",
      });
    }

    const { id } = req.params;

    const result = await Problem.findByIdAndUpdate(id, req.body);
    if (!result) {
      return res.status(404).json({ message: "Забележката не е намерена" });
    }
    //The code below sets vehicle issue property to false if all issues of that vehicle have property of done equal to TRUE

    // if (req.body.done) {
    //   const allProblemsForThisVehicle = await Problem.find({
    //     vehicleId: req.body.vehicleId,
    //   });
    //   if (allProblemsForThisVehicle.filter((item) => !item.done).length === 0) {
    //     const vehicle = await Vehicle.findById(req.body.vehicleId);
    //   }
    // }
    return res.status(200).send({ message: "Забележката е променена" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});
//Route for Deleting a Problem
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Problem.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ messga: "Забележката не е намерена" });
    }

    return res.status(200).send({ message: "Забележката е изтрита" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});
export default router;
