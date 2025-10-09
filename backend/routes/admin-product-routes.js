import express from "express";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/admin-product-controller.js";
import { upload } from "../utils/multer.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/adminMiddleware.js";

const router = express.Router();
router.post(
  "",
  upload.single("image"),
  authMiddleware,
  checkRole("admin"),

  createProduct
);
router.put(
  "/:id",
  upload.single("image"),
  authMiddleware,
  checkRole("admin"),

  updateProduct
);
router.delete("/:id", authMiddleware, checkRole("admin"), deleteProduct);

export default router;
