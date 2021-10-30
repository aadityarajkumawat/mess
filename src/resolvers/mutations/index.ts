import { createEvent } from './createEvent'
import { login } from './login'
import { register } from './register'

export default { login, register, createEvent }

export interface Mutations {
    login: typeof login
    register: typeof register
    createEvent: typeof createEvent
}
