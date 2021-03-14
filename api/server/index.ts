import './env'
import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import cors from 'cors'
import createSession from '../session'
import createSchema from '../schema'

const PORT = process.env.PORT || 8000



async function createServer() {
    try {
        // 1. create mongoose connection
        await createSession();

        // 2. create express server
        const app = express();

        const corsOptions = {
            origin: process.env.URL_APP || 'http://locahost:3000',
            credentials: true
        }

        app.use(cors(corsOptions));
        // body parser built into express
        app.use(express.json());

        const schema = await createSchema();

        // 3. create GraphQL server
        const apolloServer = new ApolloServer({
            schema,
            context: ({ req, res }) => ({ req, res }),
            introspection: true,
            playground: {
                settings: {
                    'request.credentials': 'include'
                }
            }
        });

        apolloServer.applyMiddleware({app, cors: corsOptions})

        app.listen(PORT, () => {
            console.log(`Listening on PORT ${PORT}`)
        })

    } catch (err) {
        console.log(err)
    }
}


createServer();