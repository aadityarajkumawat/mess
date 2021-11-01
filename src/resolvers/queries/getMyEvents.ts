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

        async function delay<T>(data: T) {
            return new Promise<T>((res, _) => {
                setTimeout(() => {
                    res(data)
                }, 2000)
            })
        }

        const s: GetEventsResponse = await delay({
            events: myEvents,
            error: null,
        })

        return s
    } catch (error) {
        console.log(error.message)
        return { events: [], error: error.message }
    }
}
