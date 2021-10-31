import { ResolverContext } from '../../typings'
import { MutationResponse } from '../resolvertypes'

export async function acceptInvite(
    _: any,
    args: { invite: number },
    { request, prisma }: ResolverContext,
): Promise<MutationResponse> {
    try {
        const userId = request.session.userId
        if (!userId) {
            return { status: 'NOT_OK', error: 'User is not authenticated' }
        }

        const newInvite = await prisma.invite.update({
            where: { id: args.invite },
            data: { status: true },
        })
        if (!newInvite)
            return {
                status: 'NOT_OK',
                error: 'Error while accepting the invite',
            }

        return { status: 'OK', error: null }
    } catch (error) {
        console.log(error.message)
        return { status: 'NOT_OK', error: error.message }
    }
}
