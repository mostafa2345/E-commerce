import { create } from "zustand";
import axios from "../lib/axios";
import { log } from '../utils/logger';
import toast from "react-hot-toast";


export const useProductStore=create((set,get)=>({
    products:[],
    setProducts:(products)=>set({products}),
    loading:false,
      fetchAllProducts:async()=>{
        set({loading:true})
        try {
            const res=await axios.get('/products')
             log('Fetched products:', res.data.length, 'items')
            set({products:res.data,loading:false})
        } catch (error) {
            set({loading:false})
          toast.error(error.response.data.message||'An error occured')
        }
    },

    fetchFeaturedProducts:async()=>{
        set({loading:true})
        try {
            const res=await axios.get('/products/featured')
           
            set({products:res.data,loading:false})
        } catch (error) {
            set({loading:false})
          toast.error(error.response.data.message||'An error occured')
        }
    },
    addProduct:async(productData)=>{
            set({loading:true})
            try {
                log('Adding new product:', productData)
           const res= await axios.post('/products',productData)
           log('Product added successfully:', res.data)
           set((prevstate)=>({
            products:[...prevstate.products,res.data],
            loading:false
           }))

               
                toast.success('Product added successfully')
                
            } catch (error) {
                  set({loading:false})
          toast.error(error.response.data.message||'An error occured')
            }

    },
    toggleFeatureProduct:async(productid)=>{
        set({loading:true})
        try {
           const res= await axios.patch(`/products/${productid}`)
           set((prevstate)=>({
            products:prevstate.products.map((product)=>product._id===productid ?{...product,isFeatured:res.data.isFeatured}:product)
            ,
            	loading: false,
           }))
        } catch (error) {
            set({loading:false})
            toast.error(error.response.data.message||'An error occured')
        }
    },
    deleteProduct:async(productId)=>{
         set({loading:true})
         try {
            await axios.delete(`/products/${productId}`)
               set((prevstate)=>({
                products:prevstate.products.filter((product)=>product._id!==productId),
                loading:false
               }))
            
         } catch (error) {
            set({loading:false})
            toast.error(error.response.data.message||'An error occured')
         }

    },
    fetchByCategory:async(category)=>{
        set({loading:true})
        try {
            const res=await axios.get(`/products/category/${category}`)
            set({products:res.data,loading:false})
        } catch (error) {
            set({loading:false})
          toast.error(error.response.data.message||'An error occured')
        }
    }

}))