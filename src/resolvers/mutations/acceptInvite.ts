import { ResolverContext } from '../../typings'
import { MutationResponse } from '../resolvertypes'
import { joinEvent } from './joinEvent'

export async function acceptInvite(
    _: any,
    args: { invite: number },
    { request, prisma, response }: ResolverContext,
): Promise<MutationResponse> {
    try {
        const userId = request.session.userId
        if (!userId) {
            return { status: 'NOT_OK', error: 'User is not authenticated' }
        }

        const currentInvite = await prisma.invite.findFirst({
            where: { id: args.invite },
        })

        if (!currentInvite) return { status: 'NOT_OK', error: 'process failed' }

        const newInvite = await prisma.invite.update({
            where: { id: args.invite },
            data: { status: !currentInvite.status },
        })

        if (!newInvite)
            return {
                status: 'NOT_OK',
                error: 'Error while accepting the invite',
            }

        await joinEvent(
            null,
            { event: newInvite.eventId },
            { request, response, prisma },
        )

        return { status: 'OK', error: null }
    } catch (error) {
        console.log(error.message)
        return { status: 'NOT_OK', error: error.message }
    }
}
