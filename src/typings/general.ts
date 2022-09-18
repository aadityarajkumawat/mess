import { Prisma, PrismaClient } from '@prisma/client'
import { RedisClient } from 'redis'
import { RedisStore } from 'src/resolvers/resolvertypes'

export type PrismaContext = PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
>

export type ResolverContext = {
    request: Express.Request & { session: { userId: string } }
    response: Response
    prisma: PrismaContext
    redis: RedisStore
}

export type ContextParams = {
    prisma: PrismaContext
    redis: RedisStore
}
