import { ResolverContext } from '../../typings'

export async function getUsersInMyCity(
    _: any,
    args: { event: number },
    { request, prisma }: ResolverContext,
): Promise<{ users: Array<{ name: string }>; error: string | null }> {
    try {
        const userId = request.session.userId
        if (!userId) {
            return { users: [], error: 'User is not authenticated' }
        }

        const usersInMyCity = await prisma.user.findMany({
            where: {
                city: (
                    await prisma.user.findFirst({ where: { id: userId } })
                )?.city,
                NOT: {
                    id: userId,
                },
            },
            include: {
                Profile: {
                    select: {
                        image: true,
                        bio: true,
                    },
                },
            },
        })

        const arr = []

        for (let i = 0; i < usersInMyCity.length; i++) {
            let user = usersInMyCity[i]

            let newUser = {
                ...user,
                invited:
                    (await prisma.invite.count({
                        where: {
                            fromUser: { id: userId },
                            event: { id: args.event },
                            toUser: user.id,
                        },
                    })) > 0,
            }

            arr.push(newUser)
        }

        return { users: arr, error: null }
    } catch (error) {
        console.log(error.message)
        return { users: [], error: error.message }
    }
}
