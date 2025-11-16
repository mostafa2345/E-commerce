import { create } from 'zustand'
import axios from '../lib/axios'
import { log } from '../utils/logger.js'
import toast from "react-hot-toast";

import axiosInstance from "../lib/axios";

export const useCartStore=create((set,get)=>({
    cart:[],
    coupon:null,
    total:0,
    subtotal:0,
    isCouponApplied:false,

    getMyCoupon:async()=>{
        try {
            const res=await axiosInstance.get('/coupons')
            set({coupon:res.data})
        } catch (error) {
            log('Error fetching coupon:', error.message)
            
        }
    },
    applyCoupon:async(code)=>{
        try {
            
        const res=await axiosInstance.post('/coupons/validate',{code})
        set({coupon:res.data,isCouponApplied:true})
        get().calcTotals()
        toast.success('Coupon is applied successfully')

    
        } catch (error) {
            toast.error(error.response?.data?.message||'Failed to apply coupon')
        }
    },
    removeCoupon:async()=>{
        set({coupon:null,isCouponApplied:false})
        get().calcTotals()
        toast.success('Coupon removed')
        

    },




    getCartItems:async()=>{
        try {
            const res=await axios.get('/cart')
            log('Fetched cart items:', res.data.length, 'items')
            set({cart:res.data})
             get().calcTotals()
        } catch (error) {
            set({cart:[]})
            toast.error(error.response.data.message||'An error occured')
        }
    },

    addToCart:async(product)=>{
        try {
            await axios.post('/cart',{productId:product._id});
            toast.success('Product added successfully');
            set((prevState)=>{
                const existingItem = prevState.cart.find(item => item._id === product._id);
                const newCart = existingItem 
                    ? prevState.cart.map(item => 
                        item._id === product._id 
                            ? {...item, quantity: item.quantity + 1} 
                            : item
                    )
                    : [...prevState.cart, {...product, quantity: 1}];
                return {cart: newCart};
            });
            get().calcTotals();
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred');
        }
       

        

    },
    clearCart:async()=>{
        set({cart:[],coupon:null,total:0,subtotal:0})
    },
    removeFromCart:async(productId)=>{
       
      try {
          await axios.delete(`/cart/${productId}`);
          set((prevstate)=>({
              cart: prevstate.cart.filter(item => item._id !== productId)
          }));
          get().calcTotals();
      } catch (error) {
          toast.error(error.response?.data?.message || 'An error occurred');
      }
    },
    updateQuantity:async(productId,quantity)=>{
      
        try {
              if(quantity===0){
            get().removeFromCart(productId)
            return
        }
         await axios.put(`/cart/${productId}`,{quantity})
            set((prev)=>({
                cart:prev.cart.map((item)=>(item._id===productId?{...item,quantity}:item))
            }))
            get().calcTotals()
        } catch (error) {
              toast.error(error.response?.data?.message || 'An error occurred');
        }
    }
    ,
    calcTotals:()=>{
        const {cart,coupon,isCouponApplied}=get()
        const subtotal=cart.reduce((sum,item)=>sum+item.price*item.quantity,0)
        let total=subtotal

        if(coupon&&isCouponApplied){
            const discount=subtotal*(coupon.discountPercentage/100)
            total=subtotal-discount
        }
        set({subtotal,total})
    }

    
    
}))