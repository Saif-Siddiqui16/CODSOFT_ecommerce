import Stripe from "stripe";
import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const createPayment = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { orderId } = req.body;

    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100),
      payment_method: "card",
      currency: "inr",
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      metadata: {
        orderId: order._id.toString(),
        userId: userId.toString(),
      },
    });

    const payment = new Payment({
      orderId: order._id,
      userId,
      paymentMethod: "card",
      paymentStatus: "Pending",
      amountPaid: order.totalAmount,
      paymentDate: new Date(),
      paymentId: paymentIntent.id,
    });

    await payment.save();

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Create Payment Error:", error);
    res.status(500).json({ message: "Failed to create payment" });
  }
};

export const checkoutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log(session);
  } catch (error) {
    console.log(error);
  }
};
