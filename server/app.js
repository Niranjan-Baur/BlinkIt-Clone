import "dotenv/config"
import fastify from "fastify"
import { connectDB } from "./src/config/connect.js"
import { admin, buildAdminRouter } from "./src/config/setup.js"
import { registerRoutes } from "./src/routes/index.js"
import fastifySocketIO from "fastify-socket.io"

const start = async () => {

    await connectDB(process.env.MONGODB_URI)

    const app = fastify()

    app.register(fastifySocketIO, {
        cors: {
            origin: '*'
        },
        pingInterval: 10000,
        pingTimeout: 5000,
        transports: ['websocket']
    })

    await registerRoutes(app)

    await buildAdminRouter(app)

    app.listen({ port: process.env.PORT || 3000 }, (err, addr) => {
        if (err) {
            console.log(err,)
        }
        else {
            console.log(`Blinkit server started on http://localhost:${process.env.PORT || 3000}${admin.options.rootPath}`)
        }
    })

    app.ready().then(() => {
        app.io.on('connection', (socket) => {
            console.log('A User Connected', socket.id)


            socket.on('joinRoom',(orderId)=>{
                socket.join(orderId)
                console.log('User Joined room ✅ ' + orderId)
            })

            socket.on('disconnect',()=>{
                console.log('User Disconnected ❌', socket.id)
            })



        })
    })
}

start()