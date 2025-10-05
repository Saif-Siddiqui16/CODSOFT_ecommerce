import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  addAddress,
  deleteAddress,
  editAddress,
  getAllAddresses,
} from "../controllers/address-controller.js";

const router = express.Router();
router.get("/", authMiddleware, getAllAddresses);
router.post("/", authMiddleware, addAddress);
router.put("/:addressId", authMiddleware, editAddress);
router.delete("/:addressId", authMiddleware, deleteAddress);

export default router;
