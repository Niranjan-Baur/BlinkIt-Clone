import { getAllCategories } from "../controllers/product/category.js"
import { getAllProducts, getProductsByCategoryId } from "../controllers/product/product.js"

export const categoryRoutes = async (fastify,options) => {
    fastify.get('/categories', getAllCategories)
} 

export const productsRoutes = async (fastify,options) => {
    fastify.get('/products', getAllProducts)
    fastify.get('/products/:categoryId', getProductsByCategoryId)
}