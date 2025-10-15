import { z } from "zod";
import Cart from "../models/Cart.js";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

const createCartSchema = z.object({
  productId: objectIdSchema,
});

const updateCartSchema = z.object({
  quantity: z
    .number({ invalid_type_error: "Quantity must be a number" })
    .int("Quantity must be an integer")
    .min(1, "Quantity must be at least 1"),
});

export const createCart = async (req, res) => {
  try {
    const { id } = req.user;

    const parsed = createCartSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { productId } = parsed.data;

    let cart = await Cart.findOne({ userId: id });

    if (!cart) {
      cart = new Cart({ userId: id, items: [{ productId, quantity: 1 }] });
    } else {
      const itemExists = cart.items.some(
        (item) => item.productId.toString() === productId
      );

      if (!itemExists) {
        cart.items.push({ productId, quantity: 1 });
      }
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Add to Cart Error:", error);
    res.status(500).json({ message: "Failed to add item to cart" });
  }
};

export const getCartDetails = async (req, res) => {
  try {
    const { id } = req.user;

    const cart = await Cart.findOne({ userId: id }).populate("items.productId");

    if (!cart) {
      return res.status(200).json({ items: [] });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("Get Cart Error:", error);
    res.status(500).json({ message: "Failed to get cart" });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { id } = req.user;
    const { itemId } = req.params;

    const idCheck = objectIdSchema.safeParse(itemId);
    if (!idCheck.success) {
      return res.status(400).json({ message: "Invalid item ID" });
    }

    const parsed = updateCartSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { quantity } = parsed.data;

    const cart = await Cart.findOne({ userId: id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items[itemIndex].quantity = quantity;

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error("Update Cart Item Error:", error);
    res.status(500).json({ message: "Failed to update cart item" });
  }
};

export const deleteCart = async (req, res) => {
  try {
    const { id } = req.user;
    const { itemId } = req.params;

    const idCheck = objectIdSchema.safeParse(itemId);
    if (!idCheck.success) {
      return res.status(400).json({ message: "Invalid item ID" });
    }

    const cart = await Cart.findOne({ userId: id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error("Remove Cart Item Error:", error);
    res.status(500).json({ message: "Failed to remove item from cart" });
  }
};
