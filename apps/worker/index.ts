
export const connectConfig = {
    connection : {
        host : process.env.UPSTASH_REDIS_REST_URL,
        port : 6379,
        password : process.env.UPSTASH_REDIS_RESET_TOKEN,
        tls : {}
    }
}