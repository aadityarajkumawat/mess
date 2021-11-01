import { ResolverContext } from '../../typings'
import { MutationResponse } from '../resolvertypes'

export async function editProfile(
    _: any,
    args: { name?: string; bio?: string; image?: string },
    { request, prisma }: ResolverContext,
): Promise<MutationResponse> {
    try {
        const userId = request.session.userId
        if (!userId) {
            return { status: 'NOT_OK', error: 'User is not authenticated' }
        }

        const currentProfile = await prisma.profile.findFirst({
            where: {
                user: { id: userId },
            },
        })
        if (!currentProfile)
            return { status: 'NOT_OK', error: 'process failed' }

        const user = await prisma.user.findFirst({
            where: {
                id: userId,
            },
        })
        if (!user) return { status: 'NOT_OK', error: 'process failed' }

        const newProfile = await prisma.profile.update({
            where: { userId },
            data: {
                user: {
                    update: {
                        name: args.name || user.name,
                    },
                },
                bio: args.bio || currentProfile.bio,
                image: args.image || currentProfile.image,
            },
        })
        if (!newProfile) return { status: 'NOT_OK', error: 'process failed' }

        await prisma.event.updateMany({
            where: {
                user: { id: userId },
            },
            data: {
                organizer: args.name,
            },
        })

        return { status: 'OK', error: null }
    } catch (error) {
        console.log(error.message)
        return { status: 'NOT_OK', error: error.message }
    }
}
