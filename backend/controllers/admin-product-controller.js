import Product from "../models/Product.js";
import handleImageUpload from "../utils/handleImageUpload.js";

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const file = req.file;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!file) {
      return res.status(400).json({ message: "Product image is required" });
    }

    const uploadResult = await handleImageUpload(file);
    if (!uploadResult || !uploadResult.secure_url) {
      return res.status(500).json({ message: "Image upload failed" });
    }

    const newProduct = new Product({
      name,
      description,
      image: uploadResult.secure_url,
      price,
      category,
    });

    await newProduct.save();

    return res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error("Create Product Error:", error);
    return res
      .status(500)
      .json({ message: "Server error while creating product" });
  }
};
export const updateProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { name, description, price, category } = req.body;

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;

    if (req.file) {
      const uploadResult = await handleImageUpload(req.file);
      if (!uploadResult || !uploadResult.secure_url) {
        return res.status(500).json({ message: "Image upload failed" });
      }
      product.image = uploadResult.secure_url;
    }

    await product.save();

    return res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    return res
      .status(500)
      .json({ message: "Server error while updating product" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    return res
      .status(500)
      .json({ message: "Server error while deleting product" });
  }
};
