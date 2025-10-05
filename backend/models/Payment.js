import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    paymentMethod: String,
    paymentStatus: String,
    paymentId: String,
    payerId: String,
    amountPaid: Number,
    paymentDate: Date,
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
