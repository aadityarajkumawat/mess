import { ResolverContext } from '../../typings'
import { GetEventsResponse } from '../resolvertypes'

export async function getEvents(
    _: any,
    __: any,
    { request, prisma }: ResolverContext,
): Promise<GetEventsResponse> {
    try {
        const userId = request.session.userId
        if (!userId) {
            return { events: [], error: 'User is not authenticated' }
        }

        const events = await prisma.event.findMany({
            where: { user: { NOT: { id: userId } } },
        })
        if (!events) return { events: [], error: 'process failed' }

        const arr = []

        for (let i = 0; i < events.length; i++) {
            arr[i] = {
                ...events[i],
                joined:
                    (await prisma.attendEvents.count({
                        where: {
                            event: { id: events[i].id },
                            user: { id: userId },
                        },
                    })) > 0,
            }
        }

        return { events: arr, error: null }
    } catch (error) {
        console.log(error.message)
        return { events: [], error: error.message }
    }
}
