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
  verifySession,
} from "../controllers/payment-controller.js";

const router = express.Router();

router.post("/create-checkout-session", authMiddleware, createPayment);
router.get("/verify-session/:sessionId", authMiddleware, verifySession);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;
    console.log("calllllledddddddddddd");
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const order = await Order.findById(session.metadata.orderId);
      if (!order) return res.status(404).send("Order not found");

      order.orderStatus = "Paid";
      await order.save();

      await Payment.create({
        orderId: order._id,
        userId: session.metadata.userId,
        paymentMethod: "Stripe",
        paymentStatus: "Paid",
        paymentId: session.payment_intent,
        amountPaid: session.amount_total / 100,
        paymentDate: new Date(),
      });

      // Clear cart
      await Cart.deleteOne({ userId: session.metadata.userId });
    }

    res.json({ received: true });
  }
);

router.post("/checkout-success", authMiddleware, checkoutSuccess);

export default router;
