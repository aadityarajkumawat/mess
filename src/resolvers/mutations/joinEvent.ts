import { ResolverContext } from '../../typings'
import { MutationResponse } from '../resolvertypes'

export async function joinEvent(
    _: any,
    args: { event: number },
    { request, prisma }: ResolverContext,
): Promise<MutationResponse> {
    try {
        const userId = request.session.userId
        if (!userId) {
            return { status: 'NOT_OK', error: 'User is not authenticated' }
        }

        const alreadyAttending = await prisma.attendEvents.findMany({
            where: {
                event: { id: args.event },
                user: { id: userId },
            },
        })

        if (alreadyAttending.length > 0) {
            await prisma.attendEvents.delete({
                where: {
                    id: alreadyAttending[0].id,
                },
            })
            return { status: 'OK', error: null }
        }

        const newAttendedEvent = await prisma.attendEvents.create({
            data: {
                event: { connect: { id: args.event } },
                user: { connect: { id: userId } },
            },
        })

        if (!newAttendedEvent)
            return { status: 'NOT_OK', error: 'process failed' }

        return { status: 'OK', error: null }
    } catch (error) {
        console.log(error.message)
        return { status: 'NOT_OK', error: error.message }
    }
}
