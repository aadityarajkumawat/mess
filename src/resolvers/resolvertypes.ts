import { Menu, Prisma, User, UserType } from '@prisma/client'
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

export type MenuItems = Array<{
    mealContent: string
    mealType: UserType
    mealDate: Date
}>

export type AddMenuInput = {
    menu: MenuItems
}

export type AddMenuResponse = {
    success: boolean
    error: Maybe<string>
}

export type GraphQLResponse<K extends string, T> = {
    [key in K]: T extends boolean ? T : Maybe<T>
} & {
    error: Maybe<string>
}

export type UserMenuEntry = Menu & { dineIn: boolean }
export type TodaysMenu = Array<UserMenuEntry>
export type GetTodaysMenuResponse = GraphQLResponse<'menu', TodaysMenu>
export type MutationResponse = GraphQLResponse<'success', boolean>
