import { Register, Login } from "../controllers/AuthController.js";
import express from "express";
import { userVerification } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/login", Login);
router.post("/", userVerification);
router.post("/register", Register);

export default router;
