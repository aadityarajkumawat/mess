import redis from 'redis'
import { promisifyAll } from 'bluebird'

promisifyAll(redis)

export const redisClient = redis.createClient({})
