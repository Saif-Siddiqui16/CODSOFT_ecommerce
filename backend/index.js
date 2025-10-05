import express from "express";
import dotenv from "dotenv";
import { db } from "./utils/db.js";
import authRouter from "./routes/auth-routes.js";
import cookieParser from "cookie-parser";
import adminProductsRouter from "./routes/admin-product-routes.js";
import shopProductsRouter from "./routes/product-routes.js";
import shopCartRouter from "./routes/cart-routes.js";
import shopAddressRouter from "./routes/address-routes.js";
/*
import authRouter from "./routes/auth-route.js";
import adminOrderRouter from "./routes/auth-route.js";
import shopProductsRouter from "./routes/product-route.js";


import shopOrderRouter from "./routes/order-route.js";
import shopSearchRouter from "./routes/search-route.js";
*/

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/admin/product", adminProductsRouter);
app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
/*
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);

app.use("/api/shop/products", shopProductsRouter);

app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
*/
app.listen(PORT, async () => {
  await db();
  console.log("server is running");
});
