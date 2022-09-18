import { login } from './login'
import { register } from './register'
import { logout } from './logout'
import { refreshToken } from './refreshToken'

export default {
    login,
    register,
    refreshToken,
    logout,
}

export interface Mutations {
    login: typeof login
    register: typeof register
    refreshToken: typeof refreshToken
    logout: typeof logout
}
