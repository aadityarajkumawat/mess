import { ResolverContext } from '../../typings'
import { MutationResponse } from '../resolvertypes'

export async function logout(
    _: any,
    __: any,
    { request, response }: ResolverContext,
): Promise<MutationResponse> {
    return new Promise((res) => {
        request.session.destroy((err) => {
            // @ts-ignore
            response.clearCookie('onlyauth')
            if (err) {
                console.log(err)
                res({ status: 'NOT_OK', error: 'process failed' })
                return
            }

            res({ status: 'OK', error: null })
        })
    })
}
