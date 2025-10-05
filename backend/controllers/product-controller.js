import Product from "../models/Product.js";

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
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (error) {
    console.error("Get Product Error:", error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    return res.status(500).json({ message: "Server error fetching product" });
  }
};

export const getProductByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const products = await Product.find({ category });
    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found in this category" });
    }
    return res.status(200).json(products);
  } catch (error) {
    console.error("Get Product By Category Error:", error);
    return res
      .status(500)
      .json({ message: "Server error fetching products by category" });
  }
};
