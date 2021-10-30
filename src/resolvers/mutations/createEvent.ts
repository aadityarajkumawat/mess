import { ResolverContext } from '../../typings'
import { CreateEventInput, MutationResponse } from '../resolvertypes'

export async function createEvent(
    _: any,
    args: CreateEventInput,
    { request, prisma }: ResolverContext,
): Promise<MutationResponse> {
    try {
        const userId = request.session.userId
        if (!userId) {
            return { status: 'NOT_OK', error: 'User is not authenticated' }
        }

        const user = await prisma.user.findFirst({ where: { id: userId } })
        if (!user) return { status: 'NOT_OK', error: 'User not found' }
        let organizer = user.name

        const newEvent = await prisma.event.create({
            data: { ...args, organizer, user: { connect: { id: userId } } },
        })

        if (!newEvent) {
            return {
                status: 'NOT_OK',
                error: 'Error! while creating new event',
            }
        }

        return { status: 'OK', error: null }
    } catch (error) {
        console.log(error.message)
        return { status: 'NOT_OK', error: error.message }
    }
}
