import { redis } from "../lib/redis.js"
import Product from "../models/product.model.js"
import cloudinary from "../lib/cloudinary.js"
import { log } from '../utils/logger.js'

export const getAllProducts=async(req,res)=>{
try {
    const products=await Product.find()
    res.status(200).json(products)
} catch (error) {
    log('Error getting all products:', error.message)
    res.status(500).json({
        message:error.message,

    })
}
}


export const getFeaturedProducts=async(req,res)=>{
    try {
      let featuredProducts=  await redis.get('featuredProducts')
      if(featuredProducts){
        return res.json(JSON.parse(featuredProducts))
      }
      featuredProducts=await Product.find({isFeatured:true}).lean()
        if(!featuredProducts){
            return res.status(404).json({message:'No featured products found'})
        }
       await redis.set('featuredProducts',JSON.stringify(featuredProducts))
       res.json(featuredProducts)
    } catch (error) {
        log('Error getting featured products:', error.message)
        res.status(500).json({
            message:error.message
        })
    }
}
export const createProduct = async (req, res) => {
	try {
		const { name, description, price, image, category } = req.body;

		let cloudinaryResponse = null;

		if (image) {
			cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
		}
            log('Cloudinary upload successful:', cloudinaryResponse?.secure_url)
		const product = await Product.create({
			name,
			description,
			price:Number(price),
			image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
			category,
		});

		res.status(201).json(product);
	} catch (error) {
		console.log("Error in createProduct controller", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
export const deleteProduct=async(req,res)=>{
    try {
        const {id}=req.params
      const product=await Product.findById(id)
        if(!product){
            return res.status(404).json({message:'Product not found'})
        }
        if(product.img){
            const public_id=product.img.split('/').pop().split('.')[0]
            try {
                await cloudinary.uploader.destroy(`products/${public_id}`)
                log('Image deleted from Cloudinary successfully')
            } catch (error) {
                log('Error deleting image from Cloudinary:', error.message)

            }
           
           
        }
       await Product.findByIdAndDelete(id)
       
        res.status(200).json('Product deleted successfully')
        
    } catch (error) {
        log('Error deleting product:', error.message)
        res.status(500).json({
            message:error.message
        })
    }
}
export const getRecommendedProducts=async(req,res)=>{
    try {
        const products=await Product.aggregate([
            {
                $sample:{size:3}
            },{
                $project:{
                    _id:1,
                    description:1,
                    price:1,
                    name:1,
                    image:1,
                   
                }
            }
        ])
        res.status(200).json(products)
    } catch (error) {
        log('Error getting recommended products:', error.message)
        res.status(500).json({
            message:error.message
        })
    }
}
export const getProductsByCategory=async(req,res)=>{
const {category}=req.params
try {
    const products=await Product.find({category})
    if(!products){
        return res.status(404).json({message:'No products found'})
    }
    res.status(200).json(products)
} catch (error) {
    log('Error getting products by category:', error.message)
    res.status(500).json({
        message:error.message
    })
}
}
export const toggleFeaturedProduct=async(req,res)=>{
    try {

      const  product= await Product.findById(req.params.id)
      if(product){
        product.isFeatured=!product.isFeatured
      const updatedProduct=  await product.save()
      await updateFeaturedProductsCache()
      res.status(200).json(updatedProduct)
      }
      else{
        return res.status(404).json({message:'Product not found'})

      }
        
    } catch (error) {
        log('Error toggling featured product:', error.message)
        res.status(500).json({
            message:error.message
        })
    }
}
async function updateFeaturedProductsCache() {
    try {
        const featuredProducts=await Product.find({isFeatured:true}).lean()
        if(featuredProducts){
            await redis.set('featuredProducts',JSON.stringify(featuredProducts))
        }
    } catch (error) {
        log('Error updating featured products cache:', error.message)
        
    }
}