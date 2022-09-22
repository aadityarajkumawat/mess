import { transactionOptions } from '../../constants'
import { verifyJWT } from '../../jwt'
import { ResolverContext } from '../../typings'
import { LoginInput, LoginResponse, TnxClient } from '../resolvertypes'
import { v4 as uuid } from 'uuid'
import { signAccessToken } from '../../jwt/signAccessToken'
import { signRefreshToken } from '../../jwt/signRefreshToken'

function transactionExecuter(args: LoginInput, ctx: ResolverContext) {
    return async function (db: TnxClient) {
        // @ts-ignore
        const cookie = ctx.request.cookies.mess_manager
        const jwt = verifyJWT(cookie)

        if (cookie && !jwt.expired) {
            // @ts-ignore
            const sessionId = jwt.payload.sessionId
            ctx.redis.unset(`session-${sessionId}`)
        }

        // check if user exists
        let user = await db.user.findFirst({
            where: {
                email: args.email,
            },
        })
        if (!user) throw new Error('user does not exists')

        // if user exist, check password
        const passwordIsValid = user.password === args.password

        if (!passwordIsValid) throw new Error('invalid password')

        // if password is valid, create session
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

export async function login(
    _: any,
    args: LoginInput,
    ctx: ResolverContext,
): Promise<LoginResponse> {
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
