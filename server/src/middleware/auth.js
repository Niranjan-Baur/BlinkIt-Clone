import 'dotenv/config'
import jwt from "jsonwebtoken";

export const verifyToken = async (req, res) => {
    try {
        const authHeader = req.headers['authorization']

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.code(401).send({ message: 'Invalid or expired token' })
        }

        const token = authHeader.split(' ')[1]

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.user = decoded
        return true
    } catch (error) {
        return res.code(403).send({ message: 'Invalid or expired token' })
    }
}