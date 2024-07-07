import express from "express";
import { Log } from "../models/LogModel.js";

const router = express.Router();

//Route for saving a new Log
router.post("/", async (req, res) => {
  try {
    if (
      !req.body.date ||
      !req.body.user ||
      !req.body.changed ||
      !req.body.vehicleId
    ) {
      return res.status(400).send({
        message: "Send all required fields",
      });
    }
    const newLog = {
      date: req.body.date,
      user: req.body.user,
      changed: JSON.stringify(req.body.changed),
      vehicleId: req.body.vehicleId,
    };
    const log = await Log.create(newLog);
    return res.status(201).send(log);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route to get all Logs
router.get("/", async (req, res) => {
  try {
    const logs = await Log.find({});
    return res.status(200).json({
      count: log.length,
      data: log,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route to get All logs for a specific vehicle
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const logs = await Log.find({ vehicleId: id });
    return res.status(200).json({
      count: logs.length,
      data: logs,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

export default router;
