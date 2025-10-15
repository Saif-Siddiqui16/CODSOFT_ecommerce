import { z } from "zod";
import Address from "../models/Address.js";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

const createOrderSchema = z.object({
  cartId: objectIdSchema,
  addressId: objectIdSchema,
  orderStatus: z.string().optional(),
  payment: z.any().optional(),
});

const orderIdParamSchema = z.object({
  orderId: objectIdSchema,
});

export const createOrder = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { cartId, addressId, orderStatus = "Pending", payment } = parsed.data;

    const cartDetails = await Cart.findOne({ _id: cartId, userId })
      .populate("items.productId", "name image price")
      .lean();

    if (!cartDetails || cartDetails.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty or not found." });
    }

    const cartItems = cartDetails.items.map((item) => ({
      productId: item.productId._id,
      title: item.productId.name,
      image: item.productId.image,
      price: item.productId.price,
      quantity: item.quantity,
    }));

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const address = await Address.findOne({ _id: addressId, userId }).lean();
    if (!address) {
      return res.status(404).json({ message: "Address not found." });
    }

    const addressInfo = {
      addressId: address._id,
      address: address.address,
      city: address.city,
      pincode: address.pincode,
      phone: address.phone,
    };

    const newOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      totalAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      payment,
    });

    await newOrder.save();

    return res.status(201).json({ message: "Order created", order: newOrder });
  } catch (error) {
    console.error("Create Order Error:", error);
    return res
      .status(500)
      .json({ message: "Server error while creating order" });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found." });
    }

    return res.status(200).json({ orders });
  } catch (error) {
    console.error("Get User Orders Error:", error);
    return res
      .status(500)
      .json({ message: "Server error while fetching orders" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const parsed = orderIdParamSchema.safeParse(req.params);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid order ID",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { orderId } = parsed.data;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    return res.status(200).json({ order });
  } catch (error) {
    console.error("Get Order By ID Error:", error);
    return res
      .status(500)
      .json({ message: "Server error while fetching order" });
  }
};
