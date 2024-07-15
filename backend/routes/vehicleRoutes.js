import express from "express";
import { Vehicle } from "../models/VehicleModel.js";
import { Service } from "../models/ServiceModel.js";

const router = express.Router();

//Route for save a new vehicle
router.post("/", async (req, res) => {
  try {
    if (
      !req.body.type ||
      !req.body.site ||
      !req.body.make ||
      !req.body.model ||
      !req.body.reg ||
      !req.body.year ||
      !req.body.km ||
      !req.body.fuel ||
      !req.body.engNum ||
      !req.body.bodyNum ||
      !req.body.talonNum ||
      !req.body.gtp ||
      !req.body.kaskoDate ||
      !req.body.insDate ||
      !req.body.insNum ||
      !req.body.vignetteDate ||
      !req.body.tax ||
      !req.body.owner ||
      !req.body.cat ||
      !req.body.oil ||
      !req.body.oilChange ||
      !req.body.tires
    ) {
      return res.status(400).send({
        message: "Send all required fields",
      });
    }
    const newVehicle = {
      type: req.body.type,
      site: req.body.site,
      make: req.body.make,
      model: req.body.model,
      reg: req.body.reg,
      year: req.body.year,
      km: req.body.km,
      fuel: req.body.fuel,
      engNum: req.body.engNum,
      bodyNum: req.body.bodyNum,
      talonNum: req.body.talonNum,
      gtp: req.body.gtp,
      insDate: req.body.insDate,
      insNum: req.body.insNum,
      kasko: req.body.kasko,
      kaskoDate: req.body.kaskoDate,
      kaskoNum: req.body.kaskoNum,
      tax: req.body.tax,
      owner: req.body.owner,
      cat: req.body.cat,
      oil: req.body.oil,
      oilChange: req.body.oilChange,
      vignette: req.body.vignette,
      vignetteDate: req.body.vignetteDate,
      tires: req.body.tires,
      purchaseDate: req.body.purchaseDate,
      startDate: req.body.startDate,
      startKm: req.body.startKm,
      price: req.body.price,
      checked: new Date().toISOString(),
    };

    const checkReg = await Vehicle.find({ reg: req.body.reg });
    // if (checkReg) {
    //   return res
    //     .status(400)
    //     .send({ message: "МПС с такъв Рег. Номер вече съществува" });
    // }
    const vehicle = await Vehicle.create(newVehicle);
    return res.status(201).send(vehicle);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route for Get All Vehicles from database
router.get("/", async (req, res) => {
  try {
    const vehicles = await Vehicle.find({});
    return res.status(200).json({
      count: vehicles.length,
      data: vehicles,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});
//Route for Get One Vehicle from database by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findById(id);

    return res.status(200).json(vehicle);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route for Update a Vehicle
router.put("/:id", async (req, res) => {
  try {
    if (
      !req.body.type ||
      !req.body.site ||
      !req.body.make ||
      !req.body.model ||
      !req.body.reg ||
      !req.body.year ||
      !req.body.km ||
      !req.body.fuel ||
      !req.body.engNum ||
      !req.body.bodyNum ||
      !req.body.talonNum ||
      !req.body.gtp ||
      !req.body.insDate ||
      !req.body.insNum ||
      !req.body.tax ||
      !req.body.owner ||
      !req.body.cat ||
      !req.body.oil ||
      !req.body.oilChange ||
      !req.body.tires
    ) {
      return res.status(400).send({
        message: "Send all required fields",
      });
    }

    const { id } = req.params;

    const result = await Vehicle.findByIdAndUpdate(id, req.body);
    if (!result) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    return res.status(200).send({ message: "Vehicle Updated" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route for Deleting a Vehicle
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Vehicle.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    return res.status(200).send({ message: "Vehicle Deleted" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

export default router;
