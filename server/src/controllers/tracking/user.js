import { Customer, DeliveryPartner } from "../../models/index.js"


export const updateUser = async (req, res) => {
    try {
        const { userId } = req.user
        const updateData = req.body

        let user = await Customer.findById(userId) || DeliveryPartner.findById(userId)

        if (!user) {
            return res.status(404).send({ message: 'User not found' })
        }

        let UserModel

        switch (user.role) {
            case 'Customer':
                UserModel = Customer
                break;
            case 'DeliveryPartner':
                UserModel = DeliveryPartner
                break;
            default:
                return res.status(400).send({ message: 'Invalid user role' })
        }

        const updateUser = await UserModel.findByIdAndUpdate(
            userId,
            { $set: updateData },
            {
                new: true,
                runValidators: true
            }
        )

        // This is also works 🔼
        // const updateUser = await UserModel.findByIdAndUpdate(
        //     userId,
        //     updateData,
        //     {
        //         new: true,
        //         runValidators: true
        //     }
        // )

        if (!updateUser) {
            return res.status(404).send({ message: 'User not found' })
        }

        return res.send({ message: 'User updated successfully', user: updateUser })

    } catch (error) {

    }
}