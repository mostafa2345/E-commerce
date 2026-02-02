import Order from "../models/order.model.js";
import Coupon from "../models/coupon.model.js";
import { generateOrderNumber } from "../utils/generateOrderNumbers.js";
export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const { cart, coupon, isCouponApplied, checkoutData } = req.body;

    const totalAmount = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    let discountAmount = 0;
    let finalAmount = totalAmount;
    let couponId = null;

    if (coupon && isCouponApplied) {
      const couponDoc = await Coupon.findOne({ code: coupon.code });
      if (!couponDoc) {
        return res.status(400).json({ message: "Invalid coupon code" });
      }
      discountAmount = totalAmount * (couponDoc.discountPercentage / 100);
      finalAmount = Math.max(totalAmount - discountAmount, 0);
      couponId = couponDoc._id;
    }

    const orderNumber = await generateOrderNumber();
    
    const orderProducts = cart.map((item) => ({
      product: item._id, // the Product reference
      quantity: item.quantity,
      price: item.price,
    }));
    const existingOrder = await Order.findOne({
      user: userId,
      products:orderProducts,
      status: "pending",
    });
    console.log("Existing order:", existingOrder);
    const order = new Order({
      orderNumber,
      totalAmount,
      discountAmount,
      finalAmount,
      user: userId,
      products: orderProducts,
      coupon: couponId,
      isCouponApplied,
      paymentMethod: checkoutData.paymentMethod,

      shippingAddress: checkoutData.shippingAddress,
      fullName: checkoutData.fullName,
      phone: checkoutData.phone,
      email: checkoutData.email,
    });
     await order.save();
    
    return res.status(200).json(order._id);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId });
    if (!orders) {
      return res.status(404).json({ message: "No orders found" });
    }
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getOrder=async(req,res)=>{
  try {
    const orderId=req.params.id;
    const order = await Order.findById(orderId).populate("products.product");;
    if(!order){
      return res.status(404).json({message:"Order not found"});
    }
    return res.json(order);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
