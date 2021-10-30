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

        const events = await prisma.event.findMany()
        return { events, error: null }
    } catch (error) {
        console.log(error.message)
        return { events: [], error: error.message }
    }
}
