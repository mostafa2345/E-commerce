import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  createCheckoutSession,
  handleWebhook,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-checkout-session", protectRoute, createCheckoutSession);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

export default router;
