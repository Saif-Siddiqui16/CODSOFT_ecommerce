/*

| Route                              | Method | Description                         |
| ---------------------------------- | ------ | ----------------------------------- |
| `/api/products`                    | `GET`  | Get all products                    |
| `/api/products/:id`                | `GET`  | Get single product by ID            |
| `/api/products/category/:category` | `GET`  | Get products by category (optional) |

getAllProducts getProduct getProductByCategory
*/

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
