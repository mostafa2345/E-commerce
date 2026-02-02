import { stripe } from "../lib/stripe.js";
import Cart from "../models/cart.model.js";
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import Payment from "../models/payment.model.js";
import { createCheckout } from "../services/payment.service.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const result = await createCheckout(req.user, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export async function handleWebhook(req, res) {
  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body, // Raw body - IMPORTANT!
      req.headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      case "checkout.session.expired":
        await handleCheckoutSessionExpired(event.data.object);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.log("Webhook handler error:", error.message);
    res.status(500).json({ error: "Webhook handler failed" });
  }
}

// Handle successful payment
async function handleCheckoutSessionCompleted(session) {
  try {
    console.log(
      "Processing checkout.session.completed for session:",
      session.id
    );

    if (session.payment_status !== "paid") {
      console.log("Payment not completed, status:", session.payment_status);
      return;
    }

    const orderId = session.metadata.orderId;
    if (!orderId) {
      throw new Error("No orderId in session metadata");
    }

    // Check if already processed (idempotency)
    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    if (order.status === "paid") {
      console.log("Order already processed:", orderId);
      return; // Already processed
    }

    // Update order to paid
    order.status = "paid";
    order.paymentSessionId = session.id;

    order.paidAt = new Date();
    await order.save();

    console.log("Order updated to paid:", orderId);

    // Deactivate coupon if used
    if (session.metadata.couponCode) {
      await Coupon.findOneAndUpdate(
        {
          code: session.metadata.couponCode,
          userId: session.metadata.userId,
        },
        { isActive: false }
      );
      console.log("Coupon deactivated:", session.metadata.couponCode);
    }

    // Update payment record
    await Payment.findOneAndUpdate(
      { paymentSessionId: session.id },
      {
        status: "success",
        completedAt: new Date(),
      }
    );

    // Clear cart
    await Cart.findOneAndUpdate(
      { userId: session.metadata.userId },
      { $set: { items: [] } }
    );

    console.log("Cart cleared for user:", session.metadata.userId);

    // TODO: Send confirmation email
    // await sendOrderConfirmationEmail(order);
  } catch (error) {
    console.log("handleCheckoutSessionCompleted error:", error.message);
    throw error;
  }
}

// Handle expired checkout session
async function handleCheckoutSessionExpired(session) {
  try {
    console.log("Processing checkout.session.expired for session:", session.id);

    const orderId = session.metadata.orderId;
    if (!orderId) return;

    await Order.findByIdAndUpdate(orderId, {
      status: "expired",
      cancelledAt: new Date(),
    });

    await Payment.findOneAndUpdate(
      { paymentSessionId: session.id },
      { status: "expired" }
    );

    console.log("Order expired:", orderId);
  } catch (error) {
    console.log("handleCheckoutSessionExpired error:", error.message);
    throw error;
  }
}

// Handle failed payment
async function handlePaymentFailed(paymentIntent) {
  try {
    const { orderId } = paymentIntent.metadata;
    // Find order by payment reference
    const order = await Order.findById(orderId);
    if (!order) {
      console.error(`Order not found for payment intent: ${paymentIntent.id}`);
      return;
    }
    if (order && order.status !== "payment_failed") {
      order.status = "payment_failed";
      order.failedAt = new Date();
      await order.save();

      await Payment.findOneAndUpdate(
        { orderId },
        {
          status: "failed",
          failedAt: new Date(),
        }
      );

      console.log("Order marked as failed:", order._id);
    }
  } catch (error) {
    console.log("handlePaymentFailed error:", error.message);
    throw error;
  }
}
