import express from "express";
import { Fuel } from "../models/FuelModel.js";

const router = express.Router();

//Route for saving a new Fuel
router.post("/", async (req, res) => {
  try {
    if (
      !req.body.date ||
      !req.body.type ||
      !req.body.invoice ||
      !req.body.km ||
      !req.body.cost ||
      !req.body.vehicleId
    ) {
      return res.status(400).send({
        message: "Send all required fields",
      });
    }
    const newFuel = {
      date: req.body.date,
      type: req.body.type,
      invoice: req.body.invoice,
      km: req.body.km,
      cost: req.body.cost,
      vehicleId: req.body.vehicleId,
    };
    const fuel = await Fuel.create(newFuel);
    return res.status(201).send(fuel);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route to get all fuels
router.get("/", async (req, res) => {
  try {
    const fuels = await Fuel.find({});
    return res.status(200).json({
      count: fuels.length,
      data: fuels,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route to get All Fuels for a specific Asset
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // const vehicle = req.body.vehicleId;
    const fuels = await Fuel.find({ vehicleId: id });
    return res.status(200).json({
      count: fuels.length,
      data: fuels,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});
//Route for Get One Fuel from database by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const fuel = await Fuel.findById(id);

    return res.status(200).json(fuel);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route for Deleting a Fuel
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Fuel.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ messga: "Fuel not found" });
    }

    return res.status(200).send({ message: "Fuel Deleted" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});
export default router;
