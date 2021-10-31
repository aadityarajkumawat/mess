import { createEvent } from './createEvent'
import { login } from './login'
import { register } from './register'
import { sendInvite } from './sendInvite'
import { acceptInvite } from './acceptInvite'
import { editProfile } from './editProfile'

export default {
    login,
    register,
    createEvent,
    sendInvite,
    acceptInvite,
    editProfile,
}

export interface Mutations {
    login: typeof login
    register: typeof register
    createEvent: typeof createEvent
    sendInvite: typeof sendInvite
    acceptInvite: typeof acceptInvite
    editProfile: typeof editProfile
}
