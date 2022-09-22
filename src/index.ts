import 'dotenv-safe/config'
import { GraphQLServer } from 'graphql-yoga'
import path from 'path'
import { ResolversI } from './resolvers'
import Resolvers from './resolvers'
import { db } from './prisma'
import { contextBuilder } from './helpers/contextBuilder'
import { ContextParams } from './typings'
import { redis } from './redis/index'
import cookieParser from 'cookie-parser'
import { GraphQLScalarType } from 'graphql'
import dayjs from 'dayjs'
import { parseDate } from './helpers/parseDate'

const dateResolver = new GraphQLScalarType({
    name: 'Date',
    serialize(value) {
        return dayjs(value).format('DD-MM-YYYY')
    },
    parseValue(value) {
        return parseDate(value)
    },
})

async function main() {
    const typeDefs = path.join(__dirname, 'graphql/typeDefs.graphql')
    const resolvers: ResolversI = Resolvers

    const context: ContextParams = {
        prisma: db,
        redis,
    }

    const server = new GraphQLServer({
        typeDefs,
        resolvers: { ...Resolvers, Date: dateResolver },
        context: (options) => contextBuilder.build(options, context),
    })

    // server.express.use(sessionMiddleware(process.env.COOKIE_SECRET as string))

    server.express.use(cookieParser())

    server.start(
        {
            cors: { origin: '*', credentials: true },
            port: parseInt(process.env.PORT as string),
        },
        (options) => {
            console.log(`Server running at port ${options.port}`)
        },
    )
}

main().catch((e) => console.log(e.message))
