import { Prisma, User } from '@prisma/client'
import { redis } from 'src/redis/index'

export type TnxClient = Prisma.TransactionClient
export type Maybe<T> = T | null

export interface UserResponse {
    error: string | null
    user: Omit<User, 'password'> | null
}

type DefaultTimePoints = 'createdAt' | 'updatedAt'

export type RegisterInput = Omit<User, 'userId' | DefaultTimePoints>
export type LoginInput = Pick<User, 'email' | 'password'>

export type AuthTokenPayload = {
    authTokenId: string
    userId: string
    tokenVersion: number
}
export type RedisStore = typeof redis

export type RegisterResponse = {
    accessToken: Maybe<string>
    error: Maybe<string>
}

export type LoginResponse = RegisterResponse
