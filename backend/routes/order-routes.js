import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createOrder,
  getOrderById,
  getUserOrders,
} from "../controllers/order-controller.js";
const router = express.Router();
router.post("/", authMiddleware, createOrder);
router.get("/my-orders", authMiddleware, getUserOrders);
router.get("/:orderId", authMiddleware, getOrderById);

export default router;
