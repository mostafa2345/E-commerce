import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  method: {
    type: String,
    enum: ["stripe", "paypal", "cash_on_delivery"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: "USD",
  },
  status: {
    type: String,
    enum: ["initiated", "pending", "success", "failed", "refunded"],
    default: "initiated",
  },
 
  paymentSessionId: {
    type: String, // gateway transaction ID (Stripe charge ID, PayPal ID, etc.)
    default: null,
  },
  receiptUrl: {
    type: String, // optional: Stripe/PayPal receipt link
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto-update timestamps
paymentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Payment", paymentSchema);
