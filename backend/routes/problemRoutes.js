import express from "express";
import { Problem } from "../models/ProblemModel.js";

const router = express.Router();

//Route for saving a new Problem
router.post("/", async (req, res) => {
  try {
    if (
      !req.body.date ||
      !req.body.desc ||
      !req.body.km ||
      !req.body.vehicleId
    ) {
      return res.status(400).send({
        message: "Send all required fields",
      });
    }
    const newProblem = {
      date: req.body.date,
      desc: req.body.desc,
      km: req.body.km,
      vehicleId: req.body.vehicleId,
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

//Route for Deleting a Problem
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Problem.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ messga: "Problem not found" });
    }

    return res.status(200).send({ message: "Problem Deleted" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});
export default router;
