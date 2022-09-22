import { getTodaysMenu } from './getTodaysMenu'
import { me } from './me'

const resolvers = {
    me,
    getTodaysMenu,
}

const rtt: Partial<Record<keyof typeof resolvers, any>> = {} as const

for (let key of Object.keys(resolvers) as Array<keyof typeof resolvers>) {
    rtt[key] = typeof resolvers[key]
}

export type Queries = typeof rtt
export default resolvers
