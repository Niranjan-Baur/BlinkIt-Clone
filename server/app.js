import "dotenv/config"
import fastify from "fastify"
import { connectDB } from "./src/config/connect.js"

const start = async () => {

    await connectDB(process.env.MONGODB_URI)

    const app = fastify()
    app.listen({ port: process.env.PORT || 3000, host: "0.0.0.0" }, (err, addr) => {
        if (err) {
            console.log(err,)
        }
        else {
            console.log(`Blinkit server started on port ${process.env.PORT || 3000}`)
        }
    })
}

start()