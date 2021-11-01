import { ResolverContext } from '../../typings'
import { GetProfileResponse } from '../resolvertypes'

export async function getProfile(
    _: any,
    __: any,
    { request, prisma }: ResolverContext,
): Promise<GetProfileResponse> {
    try {
        const userId = request.session.userId
        if (!userId) {
            return { profile: null, error: 'User is not authenticated' }
        }

        const myProfile = await prisma.profile.findFirst({
            where: {
                user: { id: userId },
            },
        })
        if (!myProfile) return { profile: null, error: 'process failed' }

        const user = await prisma.user.findFirst({
            where: { id: userId },
        })
        if (!user) return { profile: null, error: 'process failed' }

        const attended = await prisma.attendEvents.count({
            where: {
                user: { id: userId },
            },
        })

        const hosted = await prisma.event.count({
            where: {
                user: { id: userId },
            },
        })

        async function delay(data: GetProfileResponse) {
            return new Promise<GetProfileResponse>((res, _) => {
                setTimeout(() => {
                    res(data)
                }, 2000)
            })
        }

        const s: GetProfileResponse = await delay({
            profile: {
                ...myProfile,
                name: user.name,
                eventsAttended: attended,
                eventsHosted: hosted,
            },
            error: null,
        })

        return s
    } catch (error) {
        console.log(error.message)
        return { profile: null, error: error.message }
    }
}
