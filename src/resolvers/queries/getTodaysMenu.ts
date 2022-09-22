import { Menu, UserMealStatus } from '@prisma/client'
import dayjs from 'dayjs'
import { verifyJWT } from '../../jwt'
import { ResolverContext } from '../../typings'
import { GetTodaysMenuResponse, UserMenuEntry } from '../resolvertypes'

export async function getTodaysMenu(
    _: any,
    __: any,
    ctx: ResolverContext,
): Promise<GetTodaysMenuResponse> {
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

        const day = dayjs().format('YYYY-MM-DD')

        const todaysMenu = await ctx.prisma.menu.findMany({
            where: { mealDate: new Date(day) },
        })

        const isDebitUser = user.userType === 'DEB'

        function getUserStatusCall(userId: string, mealId: string) {
            return ctx.prisma.userMealStatus.findFirst({
                where: { userId, mealId },
            })
        }

        const userStatusCall = todaysMenu.map((m) =>
            getUserStatusCall(user.userId, m.mealId),
        )

        let userStatus = await ctx.prisma.$transaction(userStatusCall)
        if (!userStatus) throw new Error('unable to fetch user meal status')

        userStatus = userStatus.filter((us) => !!us)
        const findStatus = (menu: Menu) => (us: UserMealStatus | null) => {
            if (!us) return false
            return us.mealId === menu.mealId && us.userId === user.userId
        }

        const usersToMealStatus = (menu: Menu, index: number) => {
            const status = userStatus.find(findStatus(menu))

            const entryExists = !!status

            let dineIn = isDebitUser
            if (entryExists && isDebitUser) {
                dineIn = false
            } else if (entryExists && !isDebitUser) {
                dineIn = true
            }

            const meal: UserMenuEntry = { ...menu, dineIn: dineIn }
            return meal
        }

        const todaysMeals = todaysMenu.map(usersToMealStatus)

        return { menu: todaysMeals, error: null }
    } catch (e) {
        console.log(e)

        let errorMessage = e.message
        return { menu: null, error: errorMessage }
    }
}
