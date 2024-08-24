import { Category } from "../../models/index.js"

export const getAllCategories = async (_, res) => {
    try {
        const catagories = await Category.find()
        return res.send(catagories)
    } catch (error) {
        return res.status(500).send({ message: 'An error occurred', error: error })
    }
}
