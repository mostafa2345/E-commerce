import { stripe } from "../lib/stripe.js";
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import { generateOrderNumber } from "../utils/generateOrderNumbers.js";
import { log } from "../utils/logger.js";
import Payment from "../models/payment.model.js";

export async function createCheckout(user, { products, couponCode, orderId }) {
  try {
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid or empty products array" });
    }
    let totalAmount = 0;
    const lineItems = products.map((product) => {
      const amount = Math.round(product.price * 100);
      totalAmount += amount * product.quantity;
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: amount,
        },
        quantity: product.quantity || 1,
      };
    });

    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: user._id,
        isActive: true,
      });
      if (coupon) {
        totalAmount -= Math.round(
          (totalAmount * coupon.discountPercentage) / 100
        );
      }
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel?session_id={CHECKOUT_SESSION_ID}`,
      payment_intent_data: {
        
        metadata: {
          orderId,
          userId: user._id.toString(),
        },
      },
      discounts: coupon
        ? [
            {
              coupon: await createStripeCoupon(coupon.discountPercentage),
            },
          ]
        : [],
      metadata: {
        userId: user._id.toString(),
        couponCode: couponCode || "",
        products: JSON.stringify(
          products.map((p) => ({
            id: p._id,
            quantity: p.quantity,
            price: p.price,
          }))
        ),
        orderId,
      },
     
    });
    console.log(session);
    await Payment.create({
      orderId,
      userId: user._id,
      method: "stripe",
      amount: totalAmount / 100,
      currency: "USD",
      status: "initiated",
      
      paymentSessionId: session.id,
    });

    await Order.findByIdAndUpdate(orderId, {
      paymentSessionId: session.id,
    });
    if (totalAmount >= 20000) {
      await createNewCoupon(user._id);
    }
    return { url: session.url, totalAmount: totalAmount / 100 };
  } catch (error) {
    log("create checkout session error", error.message);
    return { message: "server error", error: error.message };
  }
}

async function createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });

  return coupon.id;
}
async function createNewCoupon(userId) {
  await Coupon.findOneAndDelete({ userId });
  const newCoupon = new Coupon({
    code: "gift" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 20,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    userId: userId,
  });
  await newCoupon.save();
  return newCoupon;
}
