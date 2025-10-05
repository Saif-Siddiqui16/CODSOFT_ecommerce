import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },

    cartItems: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        title: String,
        image: String,
        price: Number,
        quantity: Number,
      },
    ],

    addressInfo: {
      addressId: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
      address: String,
      city: String,
      pincode: String,
      phone: String,
    },

    orderStatus: { type: String, default: "Pending" },
    totalAmount: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now },
    orderUpdateDate: { type: Date, default: Date.now },

    payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
