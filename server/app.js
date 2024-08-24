import "dotenv/config"
import fastify from "fastify"
import { connectDB } from "./src/config/connect.js"
import { admin, buildAdminRouter } from "./src/config/setup.js"
import { registerRoutes } from "./src/routes/index.js"

const start = async () => {

    await connectDB(process.env.MONGODB_URI)
    
    const app = fastify()

    await registerRoutes(app)

    await buildAdminRouter(app)

    app.listen({ port: process.env.PORT || 3000, host: "0.0.0.0" }, (err, addr) => {
        if (err) {
            console.log(err,)
        }
        else {
            console.log(`Blinkit server started on http://localhost:${process.env.PORT || 3000}${admin.options.rootPath}`)
        }
    })
}

start()