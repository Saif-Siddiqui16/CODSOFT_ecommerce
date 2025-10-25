import Stripe from "stripe";
import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import Address from "../models/Address.js";
import Cart from "../models/Cart.js";
import dotenv from "dotenv";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Payment.findOne({ orderId });
    console.log(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const paymentStatus = order.paymentStatus || "Pending";

    res.status(200).json({
      paymentStatus,
    });
  } catch (error) {
    console.error("Payment status error:", error);
    res.status(500).json({ message: "Failed to fetch payment status" });
  }
};
export const createPayment = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { cartItems, addressId, totalAmount } = req.body;
    console.log(totalAmount);
    const cartId = await Cart.findOne({ userId });

    const address = await Address.findById(addressId);
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    /*
    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.productId.name,
          images: [item.productId.image],
        },
        unit_amount: Math.round(item.productId.price * 100),
      },
      quantity: item.quantity,
    }));
*/
    const order = await Order.create({
      userId,
      cartId: cartId._id,
      cartItems: cartItems.map((item) => ({
        productId: item.productId._id,
        title: item.productId.name,
        image: item.productId.image,
        price: item.productId.price,
        quantity: item.quantity,
      })),
      addressInfo: { addressId },
      totalAmount,
      orderStatus: "Pending",
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Order Total (after discount)",
            },
            unit_amount: Math.round(totalAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
      shipping_address_collection: {
        allowed_countries: ["IN"],
      },
      metadata: {
        orderId: order._id.toString(),
        userId: userId.toString(),
        addressId: addressId.toString(),
        totalAmount: totalAmount.toString(),
      },
    });
    res.status(200).json({ url: session.url });
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

export const verifySession = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(
      req.params.sessionId
    );
    if (session.payment_status === "paid") {
      const order = await Order.findById(session.metadata.orderId);

      if (order) {
        const existingPayment = await Payment.findOne({ orderId: order._id });

        if (!existingPayment) {
          await Payment.create({
            orderId: order._id,
            userId: session.metadata.userId,
            paymentMethod: "Stripe",
            paymentStatus: "Paid",
            paymentId: session.payment_intent,
            amountPaid: session.amount_total / 100,
            paymentDate: new Date(),
          });

          await Cart.deleteOne({ userId: session.metadata.userId });
        }
      }
    }

    res.json({
      amount_total: session.amount_total,
      customer_email: session.customer_details?.email,
      payment_status: session.payment_status,
    });
  } catch (error) {
    console.error("Stripe verify error:", error);
    res.status(500).json({ message: "Failed to verify payment" });
  }
};
