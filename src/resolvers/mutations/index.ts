import { login } from './login'
import { register } from './register'
import { logout } from './logout'
import { refreshToken } from './refreshToken'
import { addMenu } from './addMenu'
import { markMealStatus } from './markMealStatus'

export default {
    login,
    register,
    refreshToken,
    logout,
    addMenu,

    markMealStatus,
}

export interface Mutations {
    login: typeof login
    register: typeof register
    refreshToken: typeof refreshToken
    logout: typeof logout
    addMenu: typeof addMenu
    markMealStatus: typeof markMealStatus
}
