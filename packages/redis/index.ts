
import IOREDIS from "ioredis"

export const connection = new IOREDIS(process.env.UPSTASH_REDIS_REST_URL!, {
    maxRetriesPerRequest : null
})


