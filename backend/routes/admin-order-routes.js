import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/adminMiddleware.js";
import {
  deleteOrder,
  getAllOrdersForAdmin,
  updateOrderStatus,
} from "../controllers/admin-order-controller.js";
const router = express.Router();

router.get("", authMiddleware, checkRole("admin"), getAllOrdersForAdmin);
router.put("/:orderId", authMiddleware, checkRole("admin"), updateOrderStatus);
router.delete("/:orderId", authMiddleware, checkRole("admin"), deleteOrder);

export default router;
