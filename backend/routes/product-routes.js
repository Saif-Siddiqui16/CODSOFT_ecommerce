import express from "express";
import {
  getAllProducts,
  getProduct,
  getProductByCategory,
} from "../controllers/product-controller.js";

const router = express.Router();

router.get("", getAllProducts);
router.get("/:id", getProduct);
router.get("/category/:category", getProductByCategory);

export default router;
