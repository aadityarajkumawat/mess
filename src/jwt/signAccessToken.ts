import { signJWT } from '.'

export function signAccessToken(payload: any) {
    return signJWT(payload, '10ms')
}
