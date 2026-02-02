import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
      },
    ],

    discountAmount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
    },
    totalAmount: { type: Number, required: true, min: 0 },

    // 🔑 Payment handling
    paymentMethod: {
      type: String,
      enum: ["stripe", "bank_transfer", "cod"],
      required: true,
    },
    paymentSessionId: {
      type: String, // Stripe session ID
      unique: false,
      sparse: true, // not required for non-stripe
      default: null,
    },
 
    paymentReference: {
      type: String,
      default: "",
      // Bank transfer reference number
    },

    orderNumber: { type: String, required: true, unique: true },

    shippingAddress: {
      street: String,
      city: String,
      country: String,
      zip: String,
    },
    fullName: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },

    status: {
      type: String,
      enum: ["pending", "on-hold", "paid", "payment_failed", "canceled"],
      default: "pending",
    },
    failedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
