import express from "express";
import { addToCart, getCartProducts, removeAllFromCart, updateQuantity } from "../controllers/cart.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router=express.Router()


router.post('/',protectRoute,addToCart)
router.get('/',protectRoute,getCartProducts)
router.delete('/:id',protectRoute,removeAllFromCart)
router.put('/:id',protectRoute,updateQuantity)


export default router