import express from 'express'
import {
  getAllProducts,
  getFeaturedProducts,
  getRecommendedProducts,
  getProductsByCategory,
  getProductsBySearch,
  toggleFeaturedProduct,
  createProduct,
  deleteProduct,
  getProductById,
} from "../controllers/product.controller.js";
import {protectRoute,adminRoute} from '../middlewares/auth.middleware.js'
const router=express.Router()

// getAll
router.get('/',protectRoute,adminRoute,getAllProducts)
router.get('/featured',getFeaturedProducts)
router.get('/recommendations',getRecommendedProducts)
router.get("/by-category", getProductsByCategory);
router.post('/',protectRoute,adminRoute,createProduct)
router.patch('/:id',protectRoute,adminRoute,toggleFeaturedProduct)
router.delete('/:id',protectRoute,adminRoute,deleteProduct)
router.get('/search',getProductsBySearch)
router.get('/:id',getProductById)

//getById



export default router