import express from "express";
import {
  createCart,
  deleteCart,
  getCartDetails,
  updateCart,
} from "../controllers/cart-controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("", authMiddleware, createCart);
router.get("", authMiddleware, getCartDetails);
router.put("/:itemId", authMiddleware, updateCart);
router.delete("/:itemId", authMiddleware, deleteCart);

export default router;
