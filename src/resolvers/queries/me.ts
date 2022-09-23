import { verifyJWT } from '../../jwt'
import { ResolverContext } from 'src/typings'
import { UserResponse } from '../resolvertypes'

export async function me(
    _: any,
    __: any,
    ctx: ResolverContext,
): Promise<UserResponse> {
    try {
        // @ts-ignore
        const cookie = ctx.request.cookies.mess_manager as string

        // decode JWT received from client
        const { payload, expired } = verifyJWT(cookie)

        if (expired || !payload) throw new Error('not authenticated')

        const { sessionId } = payload as { sessionId: string }

        // find session by sessionId
        const session = (await ctx.redis.get(`session-${sessionId}`)) as {
            sessionId: string
            userId: string
        }

        const user = await ctx.prisma.user.findFirst({
            where: { userId: session.userId },
        })
        if (!user) throw new Error('user not found, session expired')

        return { user, error: null }
    } catch (error) {
        return { user: null, error: error.message }
    }
}
