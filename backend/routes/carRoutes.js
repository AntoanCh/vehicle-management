import express from "express";
import { Car } from "../models/VehicleModel.js";

const router = express.Router();

//Route for save a new car
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
    const newCar = {
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

    const car = await Car.create(newCar);
    return res.status(201).send(car);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route for Get All Cars from database
router.get("/", async (req, res) => {
  try {
    const cars = await Car.find({});
    return res.status(200).json({
      count: cars.length,
      data: cars,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});
//Route for Get One Car from database by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const car = await Car.findById(id);
    return res.status(200).json(car);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route for Update a Car
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

    const result = await Car.findByIdAndUpdate(id, req.body);
    if (!result) {
      return res.status(404).json({ message: "Car not found" });
    }
    return res.status(200).send({ message: "Car Updated" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route for Deleting a Car
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Car.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ messga: "Car not found" });
    }

    return res.status(200).send({ message: "Car Deleted" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

export default router;
