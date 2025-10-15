import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/adminMiddleware.js";
import {
  createCoupon,
  deleteCoupon,
  getCoupons,
  validateCoupon,
} from "../controllers/coupon-controller.js";

const router = express.Router();

router.post("/", authMiddleware, checkRole("admin"), createCoupon);
router.get("/", authMiddleware, checkRole("admin"), getCoupons);
router.get("/validate/:code", authMiddleware, validateCoupon);
router.delete("/:id", authMiddleware, checkRole("admin"), deleteCoupon);

export default router;
