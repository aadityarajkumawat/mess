import { ResolverContext } from '../../typings'
import { MutationResponse, SendInviteInput } from '../resolvertypes'

export async function sendInvite(
    _: any,
    args: SendInviteInput,
    { request, prisma }: ResolverContext,
): Promise<MutationResponse> {
    try {
        const userId = request.session.userId
        if (!userId) {
            return { status: 'NOT_OK', error: 'User is not authenticated' }
        }

        const newInvite = await prisma.invite.create({
            data: {
                fromUser: { connect: { id: userId } },
                status: false,
                toUser: args.to,
                event: { connect: { id: args.event } },
            },
        })
        if (!newInvite)
            return { status: 'NOT_OK', error: 'Error sending an invite' }

        return { status: 'OK', error: null }
    } catch (error) {
        console.log(error.message)
        return { status: 'NOT_OK', error: error.message }
    }
}
