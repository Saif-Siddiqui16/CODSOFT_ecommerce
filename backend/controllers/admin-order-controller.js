import Order from "../models/Order.js";
import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

const updateOrderStatusSchema = z.object({
  status: z.string().min(1, "Order status is required."),
});

export const getAllOrdersForAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("paymentId")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders." });
  }
};

export const updateOrderStatus = async (req, res) => {
  const idValidation = objectIdSchema.safeParse(req.params.orderId);
  if (!idValidation.success) {
    return res.status(400).json({ message: "Invalid order ID" });
  }

  const statusValidation = updateOrderStatusSchema.safeParse(req.body);
  console.log(statusValidation);
  if (!statusValidation.success) {
    return res.status(400).json({
      message: "Validation error",
      errors: statusValidation.error.flatten().fieldErrors,
    });
  }

  try {
    const order = await Order.findById(idValidation.data);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    order.orderStatus = statusValidation.data.status;
    order.orderUpdateDate = new Date();

    await order.save();

    res.status(200).json({ message: "Order status updated.", order });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Failed to update order status." });
  }
};

export const deleteOrder = async (req, res) => {
  const idValidation = objectIdSchema.safeParse(req.params.orderId);
  if (!idValidation.success) {
    return res.status(400).json({ message: "Invalid order ID" });
  }

  try {
    const order = await Order.findByIdAndDelete(idValidation.data);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({ message: "Order deleted successfully." });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Failed to delete order." });
  }
};
