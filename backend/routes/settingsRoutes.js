import express from "express";
import { Owner } from "../models/OwnerModel.js";

const router = express.Router();

// OWNERS________________________________________
//Route for saving a new owner
router.post("/owner/", async (req, res) => {
  try {
    if (!req.body.owner) {
      return res.status(400).send({
        message: "Send all required fields",
      });
    }
    const newOwner = {
      owner: req.body.owner,
    };
    const owner = await Owner.create(newOwner);
    return res.status(201).send(owner);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route for Get All owners from database
router.get("/owners/", async (req, res) => {
  try {
    const owners = await Owner.find({});
    return res.status(200).json({
      count: owners.length,
      data: owners,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route for Get One owner from database by id
router.get("/owner/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const owner = await Owner.findById(id);

    return res.status(200).json(owner);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route for Update a Owner
router.put("/owner/:id", async (req, res) => {
  try {
    if (!req.body.owner) {
      return res.status(400).send({
        message: "Send all required fields",
      });
    }

    const { id } = req.params;

    const result = await Owner.findByIdAndUpdate(id, req.body);
    if (!result) {
      return res.status(404).json({ message: "owner not found" });
    }
    return res.status(200).send({ message: "owner Updated" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});
//Route for Deleting a owner
router.delete("/owner/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Owner.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "owner not found" });
    }

    return res.status(200).send({ message: "owner Deleted" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//FUELS _________________________________________________
//Route for saving a new fuel
router.post("/fuel/", async (req, res) => {
  try {
    if (!req.body.fuel) {
      return res.status(400).send({
        message: "Send all required fields",
      });
    }
    const newFuel = {
      owner: req.body.fuel,
    };
    const fuel = await Fuel.create(newFuel);
    return res.status(201).send(fuel);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route for Get All fuel from database
router.get("/fuel/", async (req, res) => {
  try {
    const fuel = await Fuel.find({});
    return res.status(200).json({
      count: fuel.length,
      data: fuel,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route for Get One fuel from database by id
router.get("/fuel/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const fuel = await Fuel.findById(id);

    return res.status(200).json(fuel);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route for Update a fuel
router.put("/fuel/:id", async (req, res) => {
  try {
    if (!req.body.fuel) {
      return res.status(400).send({
        message: "Send all required fields",
      });
    }

    const { id } = req.params;

    const result = await Fuel.findByIdAndUpdate(id, req.body);
    if (!result) {
      return res.status(404).json({ message: "fuel not found" });
    }
    return res.status(200).send({ message: "fuel Updated" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});
//Route for Deleting a fuel
router.delete("/fuel/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Fuel.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "fuel not found" });
    }

    return res.status(200).send({ message: "fuel Deleted" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//LOCATIONS/SITES__________________________________________________
//Route for saving a new fuel
router.post("/site/", async (req, res) => {
  try {
    if (!req.body.site) {
      return res.status(400).send({
        message: "Send all required fields",
      });
    }
    const newSite = {
      owner: req.body.site,
    };
    const site = await Site.create(newSite);
    return res.status(201).send(site);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route for Get All site from database
router.get("/site/", async (req, res) => {
  try {
    const site = await Site.find({});
    return res.status(200).json({
      count: site.length,
      data: site,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route for Get One site from database by id
router.get("/site/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const site = await Site.findById(id);

    return res.status(200).json(site);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route for Update a site
router.put("/site/:id", async (req, res) => {
  try {
    if (!req.body.site) {
      return res.status(400).send({
        message: "Send all required fields",
      });
    }

    const { id } = req.params;

    const result = await Site.findByIdAndUpdate(id, req.body);
    if (!result) {
      return res.status(404).json({ message: "site not found" });
    }
    return res.status(200).send({ message: "site Updated" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});
//Route for Deleting a site
router.delete("/site/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Site.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "site not found" });
    }

    return res.status(200).send({ message: "site Deleted" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

export default router;
