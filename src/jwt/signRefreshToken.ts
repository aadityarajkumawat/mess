import { signJWT } from '.'

export function signRefreshToken(payload: any) {
    return signJWT(payload, '1y')
}
