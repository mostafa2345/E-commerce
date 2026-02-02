import mongoose from "mongoose";
const addressSchema = new mongoose.Schema(
  {
   
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    country: { type: String, required: true },
    isDefault: { type: Boolean, default: false }, // 👈 key field
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    fullAddress: { type: String, required: true },
  },
  { timestamps: true }
);
const profileSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  fullName: { type: String, required: true },
  phone: { type: String },
  addresses: [addressSchema],
});
const Profile=mongoose.model('Profile',profileSchema)
export default Profile