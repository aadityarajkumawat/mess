import { ResolverContext } from 'src/typings'
import { UserResponse } from '../resolvertypes'
import { serialize } from 'cookie'

export async function me(
    _: any,
    __: any,
    ___: ResolverContext,
): Promise<UserResponse> {
    return {
        user: {
            name: 'aditya',
            userId: 'e847tyr84-34ctr8734t-43rt83478r',
            userType: 'CRE',
            email: 'arkumawat78@gmail.com',
            phoneNumber: '9351101486',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        error: null,
    }
}
