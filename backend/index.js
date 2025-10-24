import express from "express";
import dotenv from "dotenv";
import { db } from "./utils/db.js";
import authRouter from "./routes/auth-routes.js";
import cookieParser from "cookie-parser";
import adminProductsRouter from "./routes/admin-product-routes.js";
import shopProductsRouter from "./routes/product-routes.js";
import shopCartRouter from "./routes/cart-routes.js";
import shopAddressRouter from "./routes/address-routes.js";
import shopOrderRouter from "./routes/order-routes.js";
import adminOrderRouter from "./routes/admin-order-routes.js";
import paymentRouter from "./routes/payment-routes.js";
import couponRouter from "./routes/coupon-routes.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

// __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/admin/product", adminProductsRouter);
app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/user/payment", paymentRouter);
app.use("/api/coupons", couponRouter);

// Serve frontend build
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Catch-all route for React Router (must be AFTER API routes)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await db();
  console.log(`Server is running on port ${PORT}`);
});
