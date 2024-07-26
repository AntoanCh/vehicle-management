import express from "express";
import { Person } from "../models/PersonModel.js";

const router = express.Router();

//Route for save a new Person
router.post("/", async (req, res) => {
  try {
    if (!req.body.siteId) {
      return res.status(400).send({
        message: "Send all required fields(siteId)",
      });
    }
    if (!req.body.firstName || !req.body.middleName || !req.body.lastName) {
      return res.status(400).send({
        message: "Send all required fields(names)",
      });
    }
    if (!req.body.EGN) {
      return res.status(400).send({
        message: "Send all required fields(EGN)",
      });
    }
    if (!req.body.job || !req.body.employmentDate) {
      return res.status(400).send({
        message: "Send all required fields(job and date)",
      });
    }
    const newPerson = {
      photo: req.body.photo,
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      IDNum: req.body.IDNum,
      EGN: req.body.EGN,
      addressOfficial: req.body.addressOfficial,
      addressReal: req.body.addressReal,
      job: req.body.job,
      marital: req.body.marital,
      telk: req.body.telk,
      education: req.body.education,
      diploma: req.body.diploma,
      major: req.body.major,
      email: req.body.email,
      phone: req.body.phone,
      phoneSecond: req.body.phoneSecond,
      employmentDate: req.body.employmentDate,
      siteId: req.body.siteId,
    };

    const existingPerson = await Person.findOne({ EGN: req.body.EGN });
    if (existingPerson) {
      return res.json({ status: "fail", message: "User already exists" });
    }
    const person = await Person.create(newPerson);
    return res.status(201).send(person);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route for Get All Persons from database
router.get("/", async (req, res) => {
  try {
    const persons = await Person.find({});
    return res.status(200).json({
      count: persons.length,
      data: persons,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});
//Route for Get One Person from database by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const person = await Person.findById(id);

    return res.status(200).json(person);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});
//Route to get All People for a specific Site
router.get("/site/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const people = await Person.find({ siteId: id });
    return res.status(200).json({
      count: people.length,
      data: people,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});
//Route for Update a Person
router.put("/:id", async (req, res) => {
  try {
    if (
      !req.body.siteId ||
      !req.body.firstName ||
      !req.body.middleName ||
      !req.body.lastName ||
      !req.body.job ||
      !req.body.employmentDate
    ) {
      return res.status(400).send({
        message: "Send all required fields",
      });
    }

    const { id } = req.params;

    const result = await Person.findByIdAndUpdate(id, req.body);
    if (!result) {
      return res.status(404).json({ message: "Person not found" });
    }
    return res.status(200).send({ message: "Person Updated" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route for Deleting a Person
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Person.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Person not found" });
    }

    return res.status(200).send({ message: "Person Deleted" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

export default router;
