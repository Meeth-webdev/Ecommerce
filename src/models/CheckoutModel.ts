import mongoose from "mongoose";

const checkoutSchema= new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    email: { type: String, required: true },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 },
        price: { type: String },
        name: { type: String },
      },
    ],
    totalAmount: { type: String, required: true },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
})
const Checkout=mongoose.models.Checkout || mongoose.model('Checkout', checkoutSchema);
export default Checkout