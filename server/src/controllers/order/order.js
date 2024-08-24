import { Branch, Customer, DeliveryPartner, Order } from "../../models/index.js"

export const createOrder = async (req, res) => {
    try {
        const { userId } = req.user

        // TODO: this is coming from frontend which is a bad practice, make this in backend
        const { items, branch, totalPrice } = req.body


        const customerData = await Customer.findById(userId)
        const branchData = await Branch.findById(branch)

        if (!customerData) {
            return res.status(404).send({ message: "Customer not found" })
        }

        const newOrder = new Order({
            customer: userId,
            items: items.map(item => ({
                id: item.id,
                item: item.item,
                count: item.count
            })),
            branch,
            totalPrice,
            deliveryLocation: {
                latitude: customerData.liveLocation.latitude,
                longitude: customerData.liveLocation.longitude,
                address: customerData.address || 'No address available'
            },
            pickupLocation: {
                latitude: branchData.location.latitude,
                longitude: branchData.location.longitude,
                address: branchData.address || 'No address available'
            }
        })

        const saveOrder = await newOrder.save()


        return res.status(201).send({ message: 'Order created successfully', order: saveOrder })

    } catch (error) {
        return res.status(500).send({ message: 'Failed to create order', error: error })
    }
}

export const confirmOrder = async (req, res) => {
    try {
        const { orderId } = req.params
        const { userId } = req.user
        const { deliveryPersonLocation } = req.body

        const delivryPerson = await DeliveryPartner.findById(userId)

        if (!delivryPerson) {
            return res.status(404).send({ message: 'Delivery person not found' })
        }

        const order = await Order.findById(orderId)
        if (!order) {
            return res.status(404).send({ message: 'Order not found' })
        }

        if (order.status !== 'available') {
            return res.status(400).send({ message: 'Order already confirmed or not available' })
        }

        order.status = 'confirmed'

        order.deliveryPartner = userId
        order.deliveryPersonLocation = {
            latitude: deliveryPersonLocation.latitude,
            longitude: deliveryPersonLocation.longitude,
            address: deliveryPersonLocation.address || ''
        }

        await order.save()

        return res.status(200).send({ message: 'Order confirmed successfully', order })


    } catch (error) {
        return res
            .status(500)
            .send({ message: 'Failed to confirm order', error: error || '' })
    }
}

export const updateOrderStatus = async (req, res) => {
    try {

        const { orderId } = req.params
        const { status, deliveryPersonLocation } = req.body

        const { userId } = req.user
        const deliveryPerson = await DeliveryPartner.findById(userId)

        if (!deliveryPerson) {
            return res.status(404).send({ message: 'Delivery person not found' })
        }

        const order = await Order.findById(orderId)
        if (!order) {
            return res.status(404).send({ message: 'Order not found' })
        }

        if (['cancelled', 'delivered'].includes(order.status)) {
            return res.status(400).send({ message: 'Order cannot be updated' })
        }

        if (order.deliveryPartner.toString() !== userId) {
            return res.status(403).send({ message: 'Unauthorized' })
        }

        order.status = status

        order.deliveryPersonLocation = deliveryPersonLocation

        await order.save()

        return res
            .status(200)
            .send({
                message: 'Order status updated successfully',
                order
            })

    } catch (error) {
        console.log(error)
        return res
            .status(500)
            .send({ message: 'Failed to update order status', error: error || '' })
    }
}

export const getOrders = async (req, res) => {
    try {
        const { status, customerId, deliveryPartnerId, branchId } = req.query

        let query = {}

        if (status) {
            query.status = status
        }

        if (customerId) {
            query.customer = customerId
        }

        if (deliveryPartnerId) {
            query.deliveryPartner = deliveryPartnerId
            query.branch = branchId
        }

        const orders = await Order.find(query).populate(
            'customer branch items.item deliveryPartner'
        )

        return res.status(200).send({ message: 'Orders fetched successfully', orders })

    }
    catch (error) {
        return res
            .status(500)
            .send({ message: 'Failed to retrive order', error: error || '' })
    }
}

export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params
        console.log(orderId)

        const order = await Order.findById(orderId).populate(
            'customer branch items.item deliveryPartner'
        )

        console.log(order)

        if(!order) {
            return res.status(404).send({ message: 'Order not found' })
        }

        return res.status(200).send({ message: 'Order fetched successfully', order })

    }
    catch (error) {
        console.log(error)
        return res
            .status(500)
            .send({ message: 'Failed to retrive order', error: error || '' })
    }
}