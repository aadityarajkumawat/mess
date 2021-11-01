import { getEvents } from './getEvents'
import { getInvites } from './getInvites'
import { getMyEvents } from './getMyEvents'
import { getProfile } from './getProfile'
import { getUsersByName } from './getUsersByName'
import { me } from './me'
import { getUsersInMyCity } from './getUsersInMyCity'

const resolvers = {
    me,
    getEvents,
    getUsersByName,
    getProfile,
    getInvites,
    getMyEvents,
    getUsersInMyCity,
}

const rtt: Partial<Record<keyof typeof resolvers, any>> = {} as const

for (let key of Object.keys(resolvers) as Array<keyof typeof resolvers>) {
    rtt[key] = typeof resolvers[key]
}

export type Queries = typeof rtt
export default resolvers
