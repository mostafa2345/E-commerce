import express from "express";
import { createOrder, getOrder, getOrders } from "../controllers/order.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.post("/create-order", protectRoute, createOrder);
router.get("/", protectRoute, getOrders);
router.get("/:id", protectRoute,getOrder);
export default router;
