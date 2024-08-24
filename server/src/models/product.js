import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    price : { type: Number, required: true },
    discountPrice: { type: Number },
    quantity: { type: String, required: true },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    }
})

export const Product = new mongoose.model('Product', productSchema)

