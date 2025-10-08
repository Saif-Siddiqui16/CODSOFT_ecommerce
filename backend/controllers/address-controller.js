import Address from "../models/Address.js";

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
    const { address, city, pincode, phone } = req.body;

    if (!address || !city || !pincode || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newAddress = new Address({
      userId: id,
      address,
      city,
      pincode,
      phone,
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
    const { addressId } = req.params;

    const { address, city, pincode, phone } = req.body;

    const existingAddress = await Address.findOne({
      _id: addressId,
      userId: id,
    });
    if (!existingAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    existingAddress.address = address || existingAddress.address;
    existingAddress.city = city || existingAddress.city;
    existingAddress.pincode = pincode || existingAddress.pincode;
    existingAddress.phone = phone || existingAddress.phone;

    await existingAddress.save();

    res
      .status(200)
      .json({ message: "Address updated", address: existingAddress });
  } catch (error) {
    console.error("Edit Address Error:", error);
    res.status(500).json({ message: "Failed to update address" });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.user;
    const { addressId } = req.params;

    const deleted = await Address.findOneAndDelete({
      _id: addressId,
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
