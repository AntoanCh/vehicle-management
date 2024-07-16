import {
  Register,
  Login,
  UpdatePswrd,
  UpdateRole,
} from "../controllers/authController.js";
import express from "express";
import { userVerification } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/login", Login);
router.post("/", userVerification);
router.post("/register", Register);
router.post("/updaterole", UpdateRole);
router.post("/updatepswrd", UpdatePswrd);

export default router;
