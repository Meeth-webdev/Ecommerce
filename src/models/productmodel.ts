import mongoose, { Schema } from "mongoose";
export interface Product extends Document{
  product:string;
  price:string;
  image:string;
  description:string;
    createdAt:string
}
const ProductSchema:Schema<Product>=new Schema({
product:{
    type:String,

},
price:{
    type:String
},
image: [String],
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