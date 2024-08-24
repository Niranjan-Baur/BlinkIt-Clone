
import 'dotenv/config'
import mongoose from "mongoose"
import { Category, Product } from "./src/models/index.js"
import { categories, products } from './seedData.js'

const seedDatabase = async () => { 
    try {
        await mongoose.connect(process.env.MONGODB_URI)

        await Product.deleteMany({})
        await Category.deleteMany({})

        const CategoryDocs = await Category.insertMany(categories)

        const categoryMaps = CategoryDocs.reduce((acc, category) => {
            acc[category.name] = category._id
            return acc
        }, {})

        const productWithCategoryIds = products.map((product) => {
            return {
                ...product,
                category: categoryMaps[product.category]
            }
        })

        await Product.insertMany(productWithCategoryIds)

        console.log('Database seeded succefully ✅')

    } catch (error) {
        console.log('Error while seeding database : ', error)
    }
    finally {
        mongoose.connection.close()
    }
}

seedDatabase()

