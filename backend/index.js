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

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use("/api/auth", authRouter);
app.use("/api/admin/product", adminProductsRouter);
app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/user/payment", paymentRouter);
app.use("/api/coupons", couponRouter);

app.listen(PORT, async () => {
  await db();
  console.log("server is running");
});
