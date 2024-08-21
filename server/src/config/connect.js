import mongoose from "mongoose"


export const connectDB = async(uri) =>{
    try {
        await mongoose.connect(uri)
        console.log('DB conneted ✅')
    } catch (error) {
        console.log('Database error: ' + error)
    }
}