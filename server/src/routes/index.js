import { authRoutes } from "./auth.js"
import { orderRoutes } from "./order.js"
import { categoryRoutes, productsRoutes } from "./product.js"


const prefix = '/api'

export const registerRoutes = async (fastify) => {
    fastify.register(authRoutes, { prefix: prefix })
    fastify.register(productsRoutes, { prefix: prefix })
    fastify.register(categoryRoutes, { prefix: prefix })
    fastify.register(orderRoutes, { prefix: prefix })
}
