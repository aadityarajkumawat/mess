import { ResolverContext } from '../../typings'
import { GetEventsResponse } from '../resolvertypes'

export async function getMyEvents(
    _: any,
    __: any,
    { request, prisma }: ResolverContext,
): Promise<GetEventsResponse> {
    try {
        const userId = request.session.userId
        if (!userId) {
            return { events: [], error: 'User is not authenticated' }
        }

        const myEvents = await prisma.event.findMany({
            where: {
                user: {
                    id: userId,
                },
            },
        })
        if (!myEvents) return { events: [], error: 'process failed' }

        return {
            events: myEvents,
            error: null,
        }
    } catch (error) {
        console.log(error.message)
        return { events: [], error: error.message }
    }
}
