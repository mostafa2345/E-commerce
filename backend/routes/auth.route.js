import express from 'express'
import {registerController,loginController,logOutController,refreshToken,getProfile} from '../controllers/auth.controller.js'
import { protectRoute } from '../middlewares/auth.middleware.js'
const router=express.Router()
router.post('/register',registerController) 
router.post('/login',loginController)
router.post('/logout',logOutController)
router.post('/refresh-token',refreshToken)
router.get('/profile',protectRoute,getProfile)



export default router