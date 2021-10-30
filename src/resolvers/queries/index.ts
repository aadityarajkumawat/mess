import { getEvents } from './getEvents'
import { me } from './me'

export default { me, getEvents }

export interface Queries {
    me: typeof me
    getEvents: typeof getEvents
}
