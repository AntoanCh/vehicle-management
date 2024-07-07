import express from "express";
import { Service } from "../models/ServiceModel.js";

const router = express.Router();

//Route for saving a new Service
router.post("/", async (req, res) => {
  try {
    if (
      !req.body.date ||
      !req.body.type ||
      !req.body.desc ||
      !req.body.invoice ||
      !req.body.km ||
      !req.body.cost ||
      !req.body.vehicleId
    ) {
      return res.status(400).send({
        message: "Send all required fields",
      });
    }
    const newService = {
      date: req.body.date,
      type: req.body.type,
      desc: req.body.desc,
      invoice: req.body.invoice,
      km: req.body.km,
      cost: req.body.cost,
      vehicleId: req.body.vehicleId,
    };
    const service = await Service.create(newService);
    return res.status(201).send(service);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route to get all services
router.get("/", async (req, res) => {
  try {
    const services = await Service.find({});
    return res.status(200).json({
      count: services.length,
      data: services,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route to get All Services for a specific Asset
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // const vehicle = req.body.vehicleId;
    const services = await Service.find({ vehicleId: id });
    return res.status(200).json({
      count: services.length,
      data: services,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});
//Route for Get One Service from database by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);

    return res.status(200).json(service);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route for Deleting a Vehicle
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Service.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ messga: "Service not found" });
    }

    return res.status(200).send({ message: "Service Deleted" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});
export default router;
