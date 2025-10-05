/*
| Route               | Method   | Description    |
| ------------------- | -------- | -------------- |
| `/api/products`     | `POST`   | Create product |
| `/api/products/:id` | `PUT`    | Update product |
| `/api/products/:id` | `DELETE` | Delete product |

*/

import express from "express";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/admin-product-controller.js";
import { upload } from "../utils/multer.js";

const router = express.Router();
router.post("", upload.single("image"), createProduct);
router.put("/:id", upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
