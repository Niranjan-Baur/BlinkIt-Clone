import 'dotenv/config'
import jwt from "jsonwebtoken";
import { Admin, Customer, DeliveryPartner } from "../../models/index.js";

const generateTokens = (user) => {
    const accessToken = jwt.sign({userId: user._id, role: user.role}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
    const refreshToken = jwt.sign({userId: user._id, role: user.role}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
    return {
        accessToken,
        refreshToken
    }
}

export const loginCustomer = async (req, res) => {

    // console.log(req.body)
    try {
        const { phone } = req.body
        let customer = await Customer.findOne({ phone })
        if (!customer) {
            customer = new Customer({
                phone,
                role: 'Customer',
                isActivated: true
            })

            await customer.save()
        }

        const { accessToken, refreshToken } = generateTokens(customer)

        return res.send({
            message: customer ? 'Login successful' : 'Customer created and login successful',
            accessToken,
            refreshToken,
            customer
        })
    } catch (error) {
        return res.status(500).send({ message: 'An error occurred', error })
    }
}

export const loginDeliveryPartner = async (req, res) => {
    try {
        const { email, password } = req.body
        let deliveryPartner = await DeliveryPartner.findOne({ email })

        if (!deliveryPartner) {
            return res.status(404).send({ message: 'Delivery partner not found' })
        }

        const isMatch = password === deliveryPartner.password

        if (!isMatch) {
            return res.status(401).send({ message: 'Invalid credentials' })
        }

        const { accessToken, refreshToken } = generateTokens(deliveryPartner)

        return res.send({
            message: 'Login successful',
            accessToken,
            refreshToken,
            deliveryPartner
        })
    } catch (error) {
        return res.status(500).send({ message: 'An error occurred' })
    }
}

export const refreshToken = async (req, res) => {
    const { refreshToken } = req.body

    if (!refreshToken) {
        return res.status(401).send({ message: 'Refresh token required' })
    }

    try {

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

        let user = {}

        switch (decoded.role) {
            case 'Customer':
                user = await Customer.findById(decoded._id)
                break;
            case 'DeliveryPartner':
                user = await DeliveryPartner.findById(decoded._id)
                break;
            default:
                return res.status(403).send({ message: 'Invalid Role' })
        }

        if (!user) {
            return res.status(403).send({ message: 'Invalid refresh token' })
        }


        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user)

        return res.send({
            message: 'Token refreshed',
            accessToken,
            refreshToken: newRefreshToken
        })
    } catch (error) {
        return res.status(403).send({ message: 'Invalid or expired token' })
    }
}

export const fetchUser = async (req, res) => {
    try {

        const {userId,role} = req.user

        let user = {}

        switch (role) {
            case 'Customer':
                user = await Customer.findById(userId)
                break;
            case 'DeliveryPartner':
                user = await DeliveryPartner.findById(userId)
                break;
            default:
                return res.status(403).send({ message: 'Invalid Role' })
        }

        if (!user) {
            return res.status(403).send({ message: 'Invalid refresh token' })
        }


        return res.send({
            message: 'User fetched successfully',
            user
        })


        console.log(req?.user)

    } catch (error) {
        return res.status(500).send({ message: 'An error occurred' })
    }
}
