import mongoose from "mongoose";

// Base user model 
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: {
        type: String,
        enum: ['Admin', 'Customer', 'DeliveryPartner']
    },
    isActivated: { type: Boolean, default: false }
})

const customerSchema = new mongoose.Schema({
    ...userSchema,
    phone: { type: String, required: true, unique: true },
    role: { type: String, enum: ['Customer'], default: 'Customer' },
    liveLocation: {
        latitude: { type: Number },
        longitude: { type: Number }
    },
    address: { type: String },
})


const deliveryPartnerSchema = new mongoose.Schema({
    ...userSchema,
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['DeliveryPartner'], default: 'DeliveryPartner' },
    liveLocation: {
        latitude: { type: Number },
        longitude: { type: Number }
    },
    address: { type: String },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch'
    }
})

// Admin Schema
const adminSchema = new mongoose.Schema({
    ...userSchema,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin'], default: 'Admin' },
})

export const Customer = mongoose.model('Customer', customerSchema)
export const DeliveryPartner = mongoose.model('DeliveryPartner', deliveryPartnerSchema)
export const Admin = mongoose.model('Admin', adminSchema)