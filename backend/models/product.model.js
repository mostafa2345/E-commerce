import mongoose from "mongoose";
const productSchema=mongoose.Schema({
 userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
    },
  
name:{
    type:String,
    required:true
},
description:{
    type:String,
    required:true,
    maxlength:120
},
price:{
    type :Number,
    required:true,
    min:0

},
discount:{
    type :Number,
    default:0
},
quantity:{
    type :Number,
    default:1
},
image:{
    type:String,
    required:[true,'img is required'],
},
category:{
    type:String,
    required:true,
},
isFeatured:{
type:Boolean,
default:false
}
},{
    timestamps:true
})
const Product=mongoose.model('Product',productSchema)
export default Product