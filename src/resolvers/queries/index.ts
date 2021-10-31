import { getEvents } from './getEvents'
import { getInvites } from './getInvites'
import { getProfile } from './getProfile'
import { getUsersByName } from './getUsersByName'
import { me } from './me'

export default { me, getEvents, getUsersByName, getProfile, getInvites }

export interface Queries {
    me: typeof me
    getEvents: typeof getEvents
    getUsersByName: typeof getUsersByName
    getProfile: typeof getProfile
    getInvites: typeof getInvites
}
