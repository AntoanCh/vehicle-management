import express from "express";
import { Site } from "../models/SiteModel.js";

const router = express.Router();

//Route for saving a new Site
router.post("/", async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).send({
        message: "Send all required fields",
      });
    }
    const newSite = {
      name: req.body.name,
      company: req.body.company,
      address: req.body.address,
      email: req.body.email,
      phone: req.body.phone,
    };
    const site = await Site.create(newSite);
    return res.status(201).send(site);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route to get all sites
router.get("/", async (req, res) => {
  try {
    const sites = await Site.find({});
    return res.status(200).json({
      count: sites.length,
      data: sites,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route for Get One Site from database by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const site = await Site.findById(id);

    return res.status(200).json(site);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route for Deleting a Site
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Site.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ messga: "Site not found" });
    }

    return res.status(200).send({ message: "Site Deleted" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});
export default router;
