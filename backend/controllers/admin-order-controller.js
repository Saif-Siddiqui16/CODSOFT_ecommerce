import Order from "../models/Order.js";

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
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Order status is required." });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    order.orderStatus = status;
    order.orderUpdateDate = new Date();

    await order.save();

    res.status(200).json({ message: "Order status updated.", order });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Failed to update order status." });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByIdAndDelete(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({ message: "Order deleted successfully." });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Failed to delete order." });
  }
};
