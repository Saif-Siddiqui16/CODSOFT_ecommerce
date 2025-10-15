import Product from "../models/Product.js";
import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format");

const categorySchema = z.object({
  category: z.string().min(1, "Category must be a non-empty string"),
});

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (error) {
    console.error("Get All Products Error:", error);
    return res.status(500).json({ message: "Server error fetching products" });
  }
};

export const getProduct = async (req, res) => {
  const validation = objectIdSchema.safeParse(req.params.id);
  if (!validation.success) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const product = await Product.findById(validation.data);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("Get Product Error:", error);
    return res.status(500).json({ message: "Server error fetching product" });
  }
};

export const getProductByCategory = async (req, res) => {
  const parsed = categorySchema.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid category",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    const { category } = parsed.data;
    const products = await Product.find({ category });

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found in this category" });
    }

    return res.status(200).json(products);
  } catch (error) {
    console.error("Get Products By Category Error:", error);
    return res
      .status(500)
      .json({ message: "Server error fetching products by category" });
  }
};
