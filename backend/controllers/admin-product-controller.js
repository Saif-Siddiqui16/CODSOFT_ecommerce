import Product from "../models/Product.js";
import handleImageUpload from "../utils/handleImageUpload.js";
import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid product ID");

const productCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .positive("Price must be a positive number"),
  category: z.string().min(1, "Category is required"),
});

const productUpdateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .positive("Price must be a positive number")
    .optional(),
  category: z.string().optional(),
  existingImage: z.string().optional(),
});

export const createProduct = async (req, res) => {
  try {
    const parsed = productCreateSchema.safeParse({
      ...req.body,
      price: parseFloat(req.body.price),
    });

    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Product image is required" });
    }

    const uploadResult = await handleImageUpload(req.file);
    if (!uploadResult?.secure_url) {
      return res.status(500).json({ message: "Image upload failed" });
    }

    const newProduct = new Product({
      ...parsed.data,
      image: uploadResult.secure_url,
    });

    await newProduct.save();

    return res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    return res
      .status(500)
      .json({ message: "Server error while creating product" });
  }
};

export const updateProduct = async (req, res) => {
  const idValidation = objectIdSchema.safeParse(req.params.id);
  if (!idValidation.success) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const product = await Product.findById(idValidation.data);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const parsed = productUpdateSchema.safeParse({
      ...req.body,
      price: req.body.price ? parseFloat(req.body.price) : undefined,
    });

    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { name, description, price, category, existingImage } = parsed.data;

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;

    if (req.file) {
      const uploadResult = await handleImageUpload(req.file);
      if (!uploadResult?.secure_url) {
        return res.status(500).json({ message: "Image upload failed" });
      }
      product.image = uploadResult.secure_url;
    } else if (existingImage) {
      product.image = existingImage;
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
  const idValidation = objectIdSchema.safeParse(req.params.id);
  if (!idValidation.success) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const product = await Product.findById(idValidation.data);
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
