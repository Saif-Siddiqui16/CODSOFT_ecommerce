import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountPercent: { type: Number, required: true },
  expiresAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
