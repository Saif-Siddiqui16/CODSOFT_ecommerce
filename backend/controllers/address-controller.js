import Address from "../models/Address.js";
import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format");

const addressSchema = z.object({
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  pincode: z
    .string()
    .min(4, "Pincode must be at least 4 digits")
    .max(10, "Pincode too long"),
  phone: z
    .string()
    .min(7, "Phone number must be at least 7 digits")
    .max(15, "Phone number too long"),
});

const optionalAddressSchema = addressSchema.partial();

export const getAllAddresses = async (req, res) => {
  try {
    const { id } = req.user;
    const addresses = await Address.find({ userId: id });
    res.status(200).json(addresses);
  } catch (error) {
    console.error("Get Addresses Error:", error);
    res.status(500).json({ message: "Failed to get addresses" });
  }
};

export const addAddress = async (req, res) => {
  try {
    const { id } = req.user;

    const parsed = addressSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const newAddress = new Address({
      userId: id,
      ...parsed.data,
    });

    await newAddress.save();

    res.status(201).json({ message: "Address added", address: newAddress });
  } catch (error) {
    console.error("Add Address Error:", error);
    res.status(500).json({ message: "Failed to add address" });
  }
};

export const editAddress = async (req, res) => {
  try {
    const { id } = req.user;

    const idValidation = objectIdSchema.safeParse(req.params.addressId);
    if (!idValidation.success) {
      return res.status(400).json({ message: "Invalid address ID" });
    }

    const bodyValidation = optionalAddressSchema.safeParse(req.body);
    if (!bodyValidation.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: bodyValidation.error.flatten().fieldErrors,
      });
    }

    const existingAddress = await Address.findOne({
      _id: idValidation.data,
      userId: id,
    });

    if (!existingAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    Object.assign(existingAddress, bodyValidation.data);
    await existingAddress.save();

    res.status(200).json({
      message: "Address updated",
      address: existingAddress,
    });
  } catch (error) {
    console.error("Edit Address Error:", error);
    res.status(500).json({ message: "Failed to update address" });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.user;

    const idValidation = objectIdSchema.safeParse(req.params.addressId);
    if (!idValidation.success) {
      return res.status(400).json({ message: "Invalid address ID" });
    }

    const deleted = await Address.findOneAndDelete({
      _id: idValidation.data,
      userId: id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({ message: "Address deleted" });
  } catch (error) {
    console.error("Delete Address Error:", error);
    res.status(500).json({ message: "Failed to delete address" });
  }
};
