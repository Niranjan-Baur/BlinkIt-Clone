import AdminJS from 'adminjs'
import AdminJSFastify from '@adminjs/fastify'
import * as AdminJSMongoose from '@adminjs/mongoose'
import * as Models from '../models/index.js'
import { authenticate, COOKIE_PASSWORD, sessionStore } from './config.js'
import {dark, light, noSidebar} from '@adminjs/themes'

AdminJS.registerAdapter(AdminJSMongoose)

export const admin = new AdminJS({
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
        },
        {
            resource: Models.Product
        },
        {
            resource: Models.Category
        },
        {
            resource: Models.Order
        },
        {
            resource: Models.Counter
        },
    ],
    branding: {
        companyName: 'BlinkIt',
        withMadeWithLove: true,
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Blinkit-yellow-app-icon.svg/1024px-Blinkit-yellow-app-icon.svg.png',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Blinkit-yellow-app-icon.svg/1024px-Blinkit-yellow-app-icon.svg.png'
    },
    defaultTheme: dark.id,
    availableThemes: [light, dark, noSidebar],

    rootPath:'/admin',
})


export const buildAdminRouter = async (app) => {
    await AdminJSFastify.buildAuthenticatedRouter(
        admin,
        {
            authenticate,
            cookiePassword: COOKIE_PASSWORD,
            cookieName: 'adminjs',
        },
        app,
        {
            store: sessionStore,
            saveUninitialized: true,
            secret: COOKIE_PASSWORD,
            cookie: {
                httpOnly: process.env.NODE_ENV === 'production',
                secure: process.env.NODE_ENV === 'production',
            }
        }
    )
}

