import { verifyJWT } from '../../jwt'
import { ResolverContext } from '../../typings'

export async function logout(
    _: any,
    __: any,
    { request, response, redis }: ResolverContext,
): Promise<any> {
    // @ts-ignore
    const cookie = request.cookies.mess_manager as string

    // decode JWT received from client
    const { payload } = verifyJWT(cookie)
    const { sessionId } = payload as { sessionId: string }

    redis.unset(`session-${sessionId}`)

    // @ts-ignore
    response.clearCookie('mess_manager')

    return { status: 'OK', error: null }
}
