
import Product from '../models/product.model.js'
export const addToCart=async(req,res)=>{

    try {
        const {productId}=req.body
        const user=req.user

        const existingitem=user.cartItems.find(item=>item.id===productId)
        if(existingitem){
            existingitem.quantity+=1
        }else{
           user.cartItems.push(productId)
        
        }
        await user.save()
        res.status(200).json(user.cartItems)

    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
export const removeAllFromCart=async(req,res)=>{
    try {
        const user=req.user
        const {id}=req.params
       
      if (!id) {
  return res.status(400).json({ message: "Product ID is required" });

}
user.cartItems = user.cartItems.filter(item => item._id.toString() !== id);

        await user.save()
          res.json(user.cartItems)
    } catch (error) {
        console.log('remove all from cart error ',error.message)
        res.status(500).json({message:'server error ',error:error.message})
    }
}


export const  updateQuantity=async(req,res)=>{
    try {
        const {id:productId}=req.params
        const {quantity}=req.body
        const user=req.user
        const existingitem=user.cartItems.find(item=>item.id===productId)
   if(existingitem){
        if(quantity===0){
            user.cartItems=user.cartItems.filter(item=>item.id!==productId)
        await user.save()
      return  res.json(user.cartItems)
        }
        existingitem.quantity=quantity
        await user.save()
        res.json(user.cartItems)
   }
   else{
    res.status(404).json({message:'Product not found'})
   }
   
   
    } catch (error) {
        console.log('update quantity controller error ' ,error.message)
        res.status(500).json({message:'server error',error:error.message})
    }
}
export const getCartProducts=async(req,res)=>{
    try {
        const user=req.user
   
        const productIds=req.user.cartItems.map(item=>item._id)
       
        const products=await Product.find({_id:{$in:productIds}})
      const cartItems=products.map(product=>{
                const item=req.user.cartItems.find(cartitem=>cartitem.id===product.id)
                return {...product.toJSON(),quantity:item.quantity}
            })
           
        res.json(cartItems)
    } catch (error) {
         console.log('get cart products  controller error ' ,error.message)
        res.status(500).json({message:'server error',error:error.message}) 
    }
}