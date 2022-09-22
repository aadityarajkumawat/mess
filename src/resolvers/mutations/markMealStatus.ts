import { verifyJWT } from '../../jwt'
import { ResolverContext } from '../../typings'
import { MutationResponse } from '../resolvertypes'

export async function markMealStatus(
    _: any,
    args: { mealId: string },
    ctx: ResolverContext,
): Promise<MutationResponse> {
    try {
        // @ts-ignore
        const cookie = ctx.request.cookies.mess_manager as string

        // decode JWT received from client
        const { payload, expired } = verifyJWT(cookie)

        if (expired) throw new Error('not authenticated')

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

        const count = await ctx.prisma.userMealStatus.count({
            where: { mealId: args.mealId, userId: user.userId },
        })

        const data = { mealId: args.mealId, userId: user.userId }

        if (count > 0) {
            await ctx.prisma.userMealStatus.delete({
                where: {
                    userId_mealId: data,
                },
            })
        } else {
            await ctx.prisma.userMealStatus.create({ data })
        }

        return { success: true, error: null }
    } catch (e) {
        let errorMessage = e.message
        return { success: false, error: errorMessage }
    }
}
