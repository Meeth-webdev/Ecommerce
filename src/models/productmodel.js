import mongoose, { Schema } from "mongoose";
const ProductSchema = new Schema({
    product: {
        type: String,
    },
    price: {
        type: String
    },
    images: {
        type: [String],
    },
    description: {
        type: String,
    },
    createdAt:{
        type:String,
    },
}, { collection: 'custom_products' });
const ProductModel = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export default ProductModel;
