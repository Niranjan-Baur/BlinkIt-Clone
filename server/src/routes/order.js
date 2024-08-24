import { confirmOrder, createOrder, getOrderById, getOrders, updateOrderStatus } from "../controllers/order/order.js"
import { verifyToken } from "../middleware/auth.js"

export const orderRoutes = async (fastify) => {
    fastify.addHook('preHandler', async (req, res) => {
        const isAuthenticated = await verifyToken(req, res)
        if (!isAuthenticated) {
            return res.code(401).send({ message: 'Unauthorized' })
        }
    })

    fastify.post('/create-order', createOrder)
    fastify.get('/orders', getOrders)
    fastify.patch('/order/:orderId/status', updateOrderStatus)
    fastify.post('/order/:orderId/confirm', confirmOrder)
    fastify.get('/order/:orderId', getOrderById)

}