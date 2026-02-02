import express from 'express'
import { protectRoute } from '../middlewares/auth.middleware.js';
import {
  getProfile,
  createProfile,
  getAddresses,
  updateAddress,
  deleteAddress,
} from "../controllers/user.controller.js";

const router=express.Router()

router.get("/profile-data", protectRoute, getProfile);
router.get("/addresses", protectRoute, getAddresses);
router.post('/create-profile',protectRoute,createProfile)
router.patch("/update-address/:id", protectRoute, updateAddress);
router.delete("/delete-address/:id", protectRoute, deleteAddress);

export default router