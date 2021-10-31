import { getEvents } from './getEvents'
import { getProfile } from './getProfile'
import { getUsersByName } from './getUsersByName'
import { me } from './me'

export default { me, getEvents, getUsersByName, getProfile }

export interface Queries {
    me: typeof me
    getEvents: typeof getEvents
    getUsersByName: typeof getUsersByName
    getProfile: typeof getProfile
}
