import { signAccessToken } from '../../jwt/signAccessToken'
import { verifyJWT } from '../../jwt'
import { ResolverContext } from '../../typings'
import { LoginResponse } from '../resolvertypes'

export async function refreshToken(
    _: any,
    __: any,
    ctx: ResolverContext,
): Promise<LoginResponse> {
    try {
        // @ts-ignore
        const cookie = ctx.request.cookies.mess_manager as string

        // decode JWT received from client
        const { payload, expired } = verifyJWT(cookie)

        if (expired) throw new Error('not authenticated')

        console.log(payload)

        const { sessionId } = payload as { sessionId: string }

        // find session by sessionId
        const session = await ctx.redis.get(`session-${sessionId}`)

        console.log(session)

        // generate new access token
        const accessToken = signAccessToken(session)

        return { accessToken, error: null }
    } catch (e) {
        let errorMessage = e.message
        return { accessToken: null, error: errorMessage }
    }
}
