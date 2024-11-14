import express from "express";
import { Driver } from "../models/DriverModel.js";

const router = express.Router();

//Route for saving a new Driver
router.post("/", async (req, res) => {
  try {
    if (!req.body.firstName || !req.body.lastName || !req.body.barcode) {
      return res.status(400).send({
        message: "Send all required fields",
      });
    }
    const newDriver = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      barcode: req.body.barcode,
      barcode2: req.body.barcode2,
      occupied: req.body.occupied,
      vehicleId: req.body.vehicleId,
    };
    const driver = await Driver.create(newDriver);
    return res.status(201).send(driver);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route to get all drivers
router.get("/", async (req, res) => {
  try {
    const drivers = await Driver.find({});
    return res.status(200).json({
      count: drivers.length,
      data: drivers,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});
//Route to get One Driver from Barcode
router.get("/barcode/:barcode", async (req, res) => {
  try {
    const { barcode } = req.params;
    const driver = await Driver.find({ barcode: barcode });
    const driver2 = await Driver.find({ barcode2: barcode });
    if (driver[0]) {
      return res.status(200).json(driver);
    } else {
      return res.status(200).json(driver2);
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});
//Route for Get One Driver from database by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const driver = await Driver.findById(id);

    return res.status(200).json(driver);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route for Update a Driver
router.put("/:id", async (req, res) => {
  try {
    if (!req.body.firstName || !req.body.lastName || !req.body.barcode) {
      return res.status(400).send({
        message: "Send all required fields",
      });
    }

    const { id } = req.params;

    const result = await Driver.findByIdAndUpdate(id, req.body);
    if (!result) {
      return res.status(404).json({ message: "Driver not found" });
    }
    return res.status(200).send({ message: "Driver Updated" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});
//Route for Deleting a Driver
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Driver.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ messga: "Driver not found" });
    }

    return res.status(200).send({ message: "Driver Deleted" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});
export default router;
