import { ResolverContext } from '../../typings'

export async function getUsersByName(
    _: any,
    args: { inputString: string },
    { request, prisma }: ResolverContext,
): Promise<{ users: Array<{ name: string }>; error: string | null }> {
    try {
        const userId = request.session.userId
        if (!userId) {
            return { users: [], error: 'User is not authenticated' }
        }

        const user = await prisma.user.findFirst({ where: { id: userId } })
        if (!user) return { users: [], error: 'process failed' }

        const usersInMyCity = await prisma.user.findMany({
            where: { name: { contains: args.inputString } },
            select: { name: true },
        })
        if (!usersInMyCity) return { users: [], error: 'process failed' }

        return { users: usersInMyCity, error: null }
    } catch (error) {
        console.log(error.message)
        return { users: [], error: error.message }
    }
}
