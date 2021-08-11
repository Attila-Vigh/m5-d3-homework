import express from "express"
import cors from "cors"
import listEndpoints from "express-list-endpoints"
import authorsRouter from "./services/authors/index.js"
import blogPostsRouter from "./services/blogPosts/index.js"
import { notFoundErrorHandler, forbiddenErrorHandler, badRequestErrorHandler, genericServerErrorHandler } from "./errorHandlers.js"

const server = express()

const port = 4001

// ***************** MIDDLEWARES *******************************

// GLOBAL LEVEL MIDDLEWARES
server.use(cors())
server.use(express.json()) // If I do not specify this line of code BEFORE the routes, all the requests' bodies will be UNDEFINED

// *************** ROUTES *****************

server.use("/authors"  , authorsRouter)
server.use("/blogPosts", blogPostsRouter)

// **************** ERROR MIDDLEWARES *******************

server.use(notFoundErrorHandler);
server.use(badRequestErrorHandler);
server.use(forbiddenErrorHandler);
server.use(genericServerErrorHandler)

console.table(listEndpoints(server))

server.listen(port, () => console.log("Server listening on port " + port) )
