import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import shopAddressRouter from "./routes/address-routes.js";
import adminOrderRouter from "./routes/admin-order-routes.js";
import adminProductsRouter from "./routes/admin-product-routes.js";
import authRouter from "./routes/auth-routes.js";
import shopCartRouter from "./routes/cart-routes.js";
import couponRouter from "./routes/coupon-routes.js";
import shopOrderRouter from "./routes/order-routes.js";
import paymentRouter from "./routes/payment-routes.js";
import shopProductsRouter from "./routes/product-routes.js";
import { db } from "./utils/db.js";

dotenv.config();
const app = express();

const _dirname = path.resolve();

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

app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.use((_, res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await db();
  console.log(`Server is running on port ${PORT}`);
});
