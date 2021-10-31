import { ResolverContext } from '../../typings'
import { RegisterInput, UserResponse } from '../resolvertypes'
import argon2 from 'argon2'

export async function register(
    _: any,
    args: RegisterInput,
    { request, prisma }: ResolverContext,
): Promise<UserResponse> {
    try {
        const data: RegisterInput = {
            ...args,
            password: await argon2.hash(args.password),
            username: args.email.substring(0, args.email.indexOf('@')),
        }
        const user = await prisma.user.create({ data })
        if (!user) return { error: 'Error while registering', user: null }
        const userProfile = await prisma.profile.create({
            data: {
                bio: '',
                eventsAttended: 0,
                eventsHosted: 0,
                user: { connect: { id: user.id } },
                image: 'https://i.ibb.co/VqQKHsL/Grey-thumb.png',
            },
        })
        if (!userProfile)
            return { error: 'Error while registering', user: null }
        request.session.userId = user.id
        return { error: null, user }
    } catch (error) {
        console.log(error.message)
        if (error.message.includes('username')) {
            return { error: 'This username is already taken', user: null }
        }
        return { error: error.message, user: null }
    }
}
