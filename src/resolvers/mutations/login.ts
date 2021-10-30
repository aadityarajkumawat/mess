import { ResolverContext } from '../../typings'
import { LoginInput, UserResponse } from '../resolvertypes'
import argon2 from 'argon2'

export async function login(
    _: any,
    args: LoginInput,
    { request, prisma }: ResolverContext,
): Promise<UserResponse> {
    try {
        const user = await prisma.user.findFirst({
            where: { email: args.email },
        })
        if (!user) return { error: 'User does not exist', user: null }
        let correctPassword = await argon2.verify(user.password, args.password)
        if (correctPassword) {
            request.session.userId = user.id
            return { error: null, user }
        } else {
            return { error: 'Wrong password', user: null }
        }
    } catch (error) {
        console.log(error.message)
        return { error: error.message, user: null }
    }
}
