import { stripe } from '../lib/stripe.js'
import Coupon from '../models/coupon.model.js'
import Order from '../models/order.model.js'
import { generateOrderNumber } from '../utils/generateOrderNumbers.js'
export const createCheckoutSession=async(req,res)=>{
    try {
        const {products,couponCode}=req.body

        if(!Array.isArray(products)||products.length===0){
            return res.status(400).json({error:'Invalid or empty products array'})
        }
        let totalAmount=0
        const lineItems=products.map(product=>{
            const amount=Math.round(product.price*100)
            totalAmount+=amount*product.quantity
            return {
                price_data:{
                    currency:'usd',
                    product_data:{
                        name:product.name,
                        images:[product.image]
                    },
                    unit_amount:amount
                },
                quantity:product.quantity||1
            }
        });

        let coupon=null
        if(couponCode){
            coupon=await Coupon.findOne({code:couponCode,userId:req.user._id,isActive:true})
            if(coupon){
                totalAmount-=Math.round(totalAmount*coupon.discountPercentage/100)
            }
        }
        const session=await stripe.checkout.sessions.create({
            payment_method_types:['card'],
            line_items:lineItems,
            mode:'payment',
            success_url:`${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url:`${process.env.CLIENT_URL}/purchase-cancel?session_id={CHECKOUT_SESSION_ID}`,

            discounts:coupon?[
                {
                    coupon:await createStripeCoupon(coupon.discountPercentage)

                }
            ]:[],
            metadata:{
                userId:req.user._id.toString(),
                couponCode:couponCode||'',
                products:JSON.stringify(products.map(p=>({
                    id:p._id,
                    quantity:p.quantity,
                    price:p.price
                })))
            }

        })
        if(totalAmount>=20000){
            await createNewCoupon(req.user._id)
        }
        res.status(200).json({url:session.url,totalAmount:totalAmount/100})

    } catch (error) {
        console.log('create checkout session error',error.message)
        res.status(500).json({message:'server error',error:error.message})
    }
}
export const checkoutSuccess=async(req,res)=>{
const{sessionId}=req.body
  if (!sessionId || typeof sessionId !== 'string') {
    return res.status(400).json({ error: 'Invalid sessionId' });
  }
try {
    const session=await stripe.checkout.sessions.retrieve(sessionId)

if(session.payment_status==='paid'){
    if(session.metadata.couponCode){
        await Coupon.findOneAndUpdate({code:session.metadata.couponCode,userId:session.metadata.userId},{isActive:false})
    }
    const products=JSON.parse(session.metadata.products)
    console.log('products',products)
    const orderNumber=await generateOrderNumber()
    const newOrder= new Order({
        user:session.metadata.userId,
        products:products.map(p=>({
            product:p.id,
            quantity:p.quantity,
            price:p.price
        })),
        totalAmount:session.amount_total/100,
        stripeSessionId:sessionId,
        orderNumber:orderNumber
    })
    console.log('new order',newOrder)
    const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
if (existingOrder) {
  return res.status(200).json({
    success: true,
    message: 'Order already exists.',
    orderId: existingOrder._id
  });
}
    await newOrder.save()
    res.status(200).json({
        success:true,
        message:'Payment successful , order created ,and coupon deactivated if used.',
        orderId:newOrder._id,
        orderNumber:orderNumber

    })
}
} catch (error) {
    console.log('checkout success error',error.message)
    res.status(500).json({message:'server error ',error:error.message})
}

} 
export const checkoutCancel=async(req,res)=>{
    const {sessionId}=req.body
      if (!sessionId || typeof sessionId !== 'string') {
    return res.status(400).json({ error: 'Invalid sessionId' });
  }
    try {
            const session = await stripe.checkout.sessions.retrieve(sessionId);
           

  
    // You could update order status in DB here if needed
    // await Order.updateOne({ stripeSessionId: sessionId }, { status: 'canceled' });

    return res.status(200).json({ message: 'Checkout canceled successfully' });
        
    } catch (error) {
         console.error('Stripe cancel error:', error.message);
    return res.status(500).json({ error: 'Failed to cancel checkout session' });
    }

}

async function createStripeCoupon(discountPercentage) {

    const coupon=await stripe.coupons.create({
        percent_off:discountPercentage,
        duration:'once',
    })

    return coupon.id
    
}
async function createNewCoupon(userId) {
    await Coupon.findOneAndDelete({userId})
    const newCoupon=new Coupon({
        code:'gift'+Math.random().toString(36).substring(2,8).toUpperCase(),
        discountPercentage:20,
        expirationDate:new Date(Date.now()+30*24*60*60*1000),
        userId:userId
    })
    await newCoupon.save()
    return newCoupon
    
}