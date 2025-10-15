import Coupon from "../models/Coupon.js";

export const createCoupon = async (req, res) => {
  try {
    const { code, discountPercent, expiresAt } = req.body;
    console.log(code, discountPercent, expiresAt);

    if (!code || !discountPercent) {
      return res
        .status(400)
        .json({ message: "Code and discount are required" });
    }

    const existing = await Coupon.findOne({ code });
    if (existing) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    const coupon = new Coupon({
      code,
      discountPercent,
      expiresAt,
      createdAt: new Date(),
    });

    await coupon.save();

    return res.status(201).json({ coupon });
  } catch (error) {
    console.error("Create Coupon Error:", error);
    return res
      .status(500)
      .json({ message: "Server error while creating coupon" });
  }
};

export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return res.status(200).json({ coupons });
  } catch (error) {
    console.error("Get Coupons Error:", error);
    return res
      .status(500)
      .json({ message: "Server error while fetching coupons" });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.params;

    const coupon = await Coupon.findOne({ code });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return res.status(400).json({ message: "Coupon has expired" });
    }

    return res.status(200).json({ coupon });
  } catch (error) {
    console.error("Validate Coupon Error:", error);
    return res
      .status(500)
      .json({ message: "Server error while validating coupon" });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Coupon.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    return res.status(200).json({ message: "Coupon deleted" });
  } catch (error) {
    console.error("Delete Coupon Error:", error);
    return res
      .status(500)
      .json({ message: "Server error while deleting coupon" });
  }
};
