import express from "express";
import { Record } from "../models/RecordModel.js";

const router = express.Router();

//Route for saving a new Record
router.post("/", async (req, res) => {
  try {
    if (
      !req.body.pickupTime ||
      !req.body.dropoffTime ||
      !req.body.driverId ||
      !req.body.vehicleId
    ) {
      return res.status(400).send({
        message: "Send all required fields",
      });
    }
    const newRecord = {
      pickupTime: req.body.pickupTime,
      dropoffTime: req.body.dropoffTime,
      driverId: req.body.driverId,
      vehicleId: req.body.vehicleId,
    };
    const record = await Record.create(newRecord);
    return res.status(201).send(record);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});
//Route for Update a Record
router.put("/:id", async (req, res) => {
  try {
    if (
      !req.body.pickupTime ||
      !req.body.dropoffTime ||
      !req.body.driverId ||
      !req.body.vehicleId
    ) {
      return res.status(400).send({
        message: "Send all required fields",
      });
    }

    const { id } = req.params;

    const result = await Record.findByIdAndUpdate(id, req.body);
    if (!result) {
      return res.status(404).json({ message: "Record not found" });
    }
    return res.status(200).send({ message: "Record Updated" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route to get all records
router.get("/", async (req, res) => {
  try {
    const records = await Record.find({});
    return res.status(200).json({
      count: records.length,
      data: records,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route to get All Records for a specific Asset
router.get("/vehicle/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const records = await Record.find({ vehicleId: id });
    return res.status(200).json({
      count: records.length,
      data: records,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});
//Route to get All Records for a specific Driver
router.get("/driver/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const records = await Record.find({ driverId: id });
    return res.status(200).json({
      count: records.length,
      data: records,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});
//Route for Get One Record from database by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const record = await Record.findById(id);

    return res.status(200).json(record);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route for Deleting a Record
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Record.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ messga: "Record not found" });
    }

    return res.status(200).send({ message: "Record Deleted" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});
export default router;
