import { redisClient } from '../redis'
import { promisify } from 'util'

const redis = {
    set: function <T>(key: string, payload: T) {
        redisClient.set(key, JSON.stringify(payload))
    },
    unset: function (key: string) {
        redisClient.del(key)
    },
    get: async function (key: string) {
        const getAsync = promisify(redisClient.get).bind(redisClient)
        return JSON.parse(await getAsync(key))
    },
}

export { redis }
