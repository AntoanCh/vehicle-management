import express from "express";
import { Truck } from "../models/VehicleModel.js";

const router = express.Router();

//Route for save a new truck
router.post("/", async (req, res) => {
  try {
    if (
      !req.body.model ||
      !req.body.reg ||
      !req.body.year ||
      !req.body.km ||
      !req.body.engNum ||
      !req.body.bodyNum ||
      !req.body.gtp ||
      !req.body.insurance ||
      !req.body.cat ||
      !req.body.oil ||
      !req.body.tax ||
      !req.body.tires ||
      !req.body.talonNum ||
      !req.body.fuel ||
      !req.body.kasko ||
      !req.body.owner
    ) {
      return res.status(400).send({
        message: "Send all required fields",
      });
    }
    const newTruck = {
      model: req.body.model,
      reg: req.body.reg,
      year: req.body.year,
      km: req.body.km,
      engNum: req.body.engNum,
      bodyNum: req.body.bodyNum,
      gtp: req.body.gtp,
      insurance: req.body.insurance,
      cat: req.body.cat,
      oil: req.body.oil,
      tax: req.body.tax,
      tires: req.body.tires,
      talonNum: req.body.talonNum,
      fuel: req.body.fuel,
      kasko: req.body.kasko,
      owner: req.body.owner,
    };

    const truck = await Truck.create(newTruck);
    return res.status(201).send(truck);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route for Get All Trucks from database
router.get("/", async (req, res) => {
  try {
    const trucks = await Truck.find({});
    return res.status(200).json({
      count: trucks.length,
      data: trucks,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});
//Route for Get One Truck from database by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const truck = await Truck.findById(id);
    return res.status(200).json(truck);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route for Update a Truck
router.put("/:id", async (req, res) => {
  try {
    if (
      !req.body.model ||
      !req.body.reg ||
      !req.body.year ||
      !req.body.km ||
      !req.body.engNum ||
      !req.body.bodyNum ||
      !req.body.gtp ||
      !req.body.insurance ||
      !req.body.cat ||
      !req.body.oil ||
      !req.body.tax ||
      !req.body.tires ||
      !req.body.talonNum ||
      !req.body.fuel ||
      !req.body.kasko ||
      !req.body.owner
    ) {
      return res.status(400).send({
        message: "Send all required fields",
      });
    }

    const { id } = req.params;

    const result = await Truck.findByIdAndUpdate(id, req.body);
    if (!result) {
      return res.status(404).json({ message: "Truck not found" });
    }
    return res.status(200).send({ message: "Truck Updated" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route for Deleting a Truck
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Truck.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ messga: "Truck not found" });
    }

    return res.status(200).send({ message: "Truck Deleted" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

export default router;
