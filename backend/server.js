import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './lib/db.js'
import authRoutes from '../backend/routes/auth.route.js'
import productRoutes from '../backend/routes/product.route.js'
import cartRoutes from '../backend/routes/cart.route.js'
import couponRoutes from '../backend/routes/coupon.route.js'
import paymentRoutes from '../backend/routes/payment.route.js'
import analyticsRoutes from '../backend/routes/analytic.route.js'
import cookieParser from 'cookie-parser'

dotenv.config()
const app=express()

const PORT=process.env.PORT||5000

app.use(express.json({ limit: "10mb" }))
app.use(cookieParser())
app.use('/api/auth',authRoutes)
app.use('/api/products',productRoutes)
app.use('/api/cart',cartRoutes)
app.use('/api/coupons',couponRoutes)
app.use('/api/payments',paymentRoutes)
app.use('/api/analytics',analyticsRoutes)

app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}` )
    connectDB()
})
