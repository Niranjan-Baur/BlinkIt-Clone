import { Product } from "../../models/index.js"


export const getAllProducts = async (_, res) => {
    try {
        const products = await Product.find()
        return res.send(products)
    } catch (error) {
        return res.status(500).send({ message: 'An error occurred', error: error })
    }
}
export const getProductsByCategoryId = async (req, res) => {

    const { categoryId } = req.params
    try {
        const products = await Product.find({ category: categoryId }).select('-category').exec()
        return res.send(products)
    } catch (error) {
        return res.status(500).send({ message: 'An error occurred', error: error })
    }
}

