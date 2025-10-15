/*
| Route                    | Method | Description                   |
| ------------------------ | ------ | ----------------------------- |
| `/api/payments`          | `POST` | Create payment                |
| `/api/payments/:orderId` | `GET`  | Get payment for order         |
| `/api/payments/user`     | `GET`  | Get all user payments         |
| `/api/payments` (admin)  | `GET`  | Get all payments (admin only) |


*/

import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  checkoutSuccess,
  createPayment,
  getPaymentStatus,
  verifySession,
} from "../controllers/payment-controller.js";

const router = express.Router();

router.post("/create-checkout-session", authMiddleware, createPayment);
router.get("/verify-session/:sessionId", authMiddleware, verifySession);
router.get("/status/:orderId", authMiddleware, getPaymentStatus);
router.post("/checkout-success", authMiddleware, checkoutSuccess);

export default router;
