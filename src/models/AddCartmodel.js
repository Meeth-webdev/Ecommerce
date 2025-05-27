import mongoose, { Schema } from "mongoose";
const AddCartSchema = new mongoose.Schema({
    productId: String,
    product: String,
    images: [String],
    price: String ,
    userEmail: String,
  }, { collection: 'Add_Cart' });
const AddCartModel = mongoose.models.AddCart || mongoose.model('AddCart', AddCartSchema);
export default AddCartModel;