import express from "express";
import {
  checkAuth,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/auth-controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", authMiddleware, checkAuth);

export default router;
