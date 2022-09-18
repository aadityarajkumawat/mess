import { signAccessToken } from '../../jwt/signAccessToken'
import { signRefreshToken } from '../../jwt/signRefreshToken'
import { v4 as uuid } from 'uuid'
import { ResolverContext } from '../../typings'
import { RegisterInput, RegisterResponse, TnxClient } from '../resolvertypes'
import { verifyJWT } from '../../jwt'
import { transactionOptions } from '../../constants'

function transactionExecuter(args: RegisterInput, ctx: ResolverContext) {
    return async function (db: TnxClient) {
        // @ts-ignore
        const cookie = ctx.request.cookies.mess_manager

        if (cookie) {
            const jwt = verifyJWT(cookie)
            // @ts-ignore
            const sessionId = jwt.payload.sessionId

            ctx.redis.unset(`session-${sessionId}`)
        }

        // check if user already exists
        let user = await db.user.findFirst({
            where: {
                email: args.email,
            },
        })
        if (user) throw new Error('user already exists')

        // if user does not exist, create new user
        const userData = { ...args, userId: uuid() }
        user = await db.user.create({ data: userData })

        // create session
        const session = { userId: user.userId, sessionId: uuid() }
        ctx.redis.set(`session-${session.sessionId}`, session)

        // once user is created generate access and refresh token
        const accessToken = signAccessToken({
            userId: user.userId,
            sessionId: session.sessionId,
        })

        const refreshToken = signRefreshToken({
            sessionId: session.sessionId,
        })

        // @ts-ignore
        ctx.response.cookie('mess_manager', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
        })

        return { accessToken, error: null }
    }
}

export async function register(
    _: any,
    args: RegisterInput,
    ctx: ResolverContext,
): Promise<RegisterResponse> {
    try {
        const res = await ctx.prisma.$transaction(
            transactionExecuter(args, ctx),
            transactionOptions,
        )

        return res
    } catch (e) {
        let errorMessage = e.message
        return { accessToken: null, error: errorMessage }
    }
}
