import mongoose from "mongoose";
import { Counter } from "./counter.js";

const orderSchema = new mongoose.Schema({

    orderId: {
        type: String,
        unique: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    deliveryPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeliveryPartner',
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required: true
    },
    items: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            count: { type: Number, required: true }
        }
    ],
    deliveryLocation: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        address: { type: String }
    },
    pickupLocation: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        address: { type: String }
    },
    deliveryPersonLocation: {
        latitude: { type: Number },
        longitude: { type: Number },
        address: { type: String }
    },
    status: {
        type: String,
        enum: ['available', 'confirmed', 'arriving', 'delivered', 'cancelled'],
        default: 'available'
    },
    totalPrice: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

const getNextSequenceValue = async (name) => {
    const counter = await Counter.findOneAndUpdate({ name }, { $inc: { seq: 1 } }, { new: true, upsert: true })
    console.log(counter,'counter')
    return counter.seq
}

orderSchema.pre('save', async function (next) {
    if (this.isNew) {
        const sequenceValue = await getNextSequenceValue('orderId')
        this.orderId = `ORDR${sequenceValue.toString().padStart(5, '0')}`
    }

    next()
})


export const Order = mongoose.model('Order', orderSchema)
