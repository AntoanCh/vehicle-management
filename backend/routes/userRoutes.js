import express from "express";
import { User } from "../models/UserModel.js";

const router = express.Router();

//Route for Get All Users from database
router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json({
      count: users.length,
      data: users,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});
//Route for Get One user from database by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    return res.status(200).json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route for Update a User
// router.put("/:id", async (req, res) => {
//   try {
//     if (
//       !req.body.type ||
//       !req.body.site ||
//       !req.body.make ||
//       !req.body.model ||
//     ) {
//       return res.status(400).send({
//         message: "Send all required fields",
//       });
//     }
//     if (!req.body.kaskoDate) {
//       req.body.kaskoDate = "00.00.0000";
//     }

//     const { id } = req.params;

//     const result = await Vehicle.findByIdAndUpdate(id, req.body);
//     if (!result) {
//       return res.status(404).json({ message: "Vehicle not found" });
//     }
//     return res.status(200).send({ message: "Vehicle Updated" });
//   } catch (err) {
//     console.log(err.message);
//     res.status(500).send({ message: err.message });
//   }
// });

//Route for Deleting a User
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await User.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).send({ message: "User Deleted" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

export default router;
