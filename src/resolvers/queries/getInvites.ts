import { ResolverContext } from '../../typings'

export async function getInvites(
    _: any,
    __: any,
    { request, prisma }: ResolverContext,
): Promise<{
    invites: Array<{
        id: number
        status: boolean
        event: {
            id: number
            eventName: string
            description: string
            interest: string
            organizer: string
        }
        fromUser: { Profile: { image: string } | null }
    }>
    error: string | null
}> {
    try {
        const userId = request.session.userId
        if (!userId) {
            return { invites: [], error: 'User is not authenticated' }
        }

        const invites = await prisma.invite.findMany({
            where: {
                toUser: userId,
            },
            select: {
                id: true,
                status: true,
                event: {
                    select: {
                        id: true,
                        eventName: true,
                        description: true,
                        interest: true,
                        organizer: true,
                    },
                },
                fromUser: {
                    select: {
                        Profile: {
                            select: {
                                image: true,
                            },
                        },
                    },
                },
            },
        })
        if (!invites) return { invites: [], error: 'process failed' }

        return { invites, error: null }
    } catch (error) {
        console.log(error.message)
        return { invites: [], error: error.message }
    }
}
