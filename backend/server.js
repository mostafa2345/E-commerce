import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import authRoutes from "../backend/routes/auth.route.js";
import productRoutes from "../backend/routes/product.route.js";
import cartRoutes from "../backend/routes/cart.route.js";
import couponRoutes from "../backend/routes/coupon.route.js";
import paymentRoutes from "../backend/routes/payment.route.js";
import analyticsRoutes from "../backend/routes/analytic.route.js";
import userRoutes from "../backend/routes/user.route.js";
import cookieParser from "cookie-parser";
import orderRoutes from "../backend/routes/order.route.js";
import path from "path";
import { log } from "./utils/logger.js";
dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();
app.use(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  paymentRoutes
);
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/orders", orderRoutes);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend", "dist")));
  app.get("/*path", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}
app.listen(PORT, () => {
  log(`Server is running on port ${PORT}`);
  connectDB();
});
