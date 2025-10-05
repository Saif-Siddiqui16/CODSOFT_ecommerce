import Cart from "../models/Cart.js";

export const createCart = async (req, res) => {
  try {
    const { id } = req.user;
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ userId: id });

    if (!cart) {
      cart = new Cart({ userId: id, items: [{ productId, quantity }] });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
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
    const { quantity } = req.body;

    const cart = await Cart.findOne({ userId: id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === itemId
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
    const cart = await Cart.findOne({ userId: id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== itemId
    );

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error("Remove Cart Item Error:", error);
    res.status(500).json({ message: "Failed to remove item from cart" });
  }
};
