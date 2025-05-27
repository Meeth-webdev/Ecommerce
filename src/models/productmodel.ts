import mongoose, { Schema } from "mongoose";
export interface Product extends Document{
  product:String;
  price:String;
  image:String;
  description:String;
    createdAt:String
}
const ProductSchema:Schema<Product>=new Schema({
product:{
    type:String,

},
price:{
    type:String
},
image:{
    type:[String],
},
description:{
    type:String,
},
createdAt:{
    type:String,
}

},




{ collection: 'custom_products' })
const ProductModel= mongoose.models.Product || mongoose.model('Product', ProductSchema);
export default ProductModel;