import { __prod__ } from './constants'
import { PrismaClient } from '@prisma/client'

declare global {
    var db: PrismaClient | undefined
}

export const db = new PrismaClient()

if (!__prod__) {
    global.db = db
}
