import AdminJS from 'adminjs'
import AdminJSFastify from '@adminjs/fastify'
import * as AdminJSMongoose from '@adminjs/mongoose'
import * as Models from '../models/index.js'

AdminJS.registerAdapter(AdminJSMongoose)

export const Admin = new AdminJS({
    resources: [
        {
            resource: Models.Customer,
            options: {
                listProperties: ['name', 'phone', 'role', 'isActivated'],
                filterProperties: ['role', 'isActivated']
            }
        },
        {
            resource: Models.DeliveryPartner,
            options: {
                listProperties: ['name', 'phone', 'email', 'role', 'isActivated'],
                filterProperties: ['email', 'isActivated']
            }
        },
        {
            resource: Models.Admin,
            options: {
                listProperties: ['name', 'email', 'role', 'isActivated'],
                filterProperties: ['email', 'isActivated']
            }
        },
        {
            resource: Models.Branch
        }
    ],
    branding:{
        companyName:'BlinkIt',
        withMadeWithLove: true,
    },
    rootPath:'/admin',
})


export const buildAdminRouter = async() =>{
    await AdminJSFastify.buildRouter()
}