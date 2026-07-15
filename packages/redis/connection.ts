import IOREDIS from "ioredis"



console.log("Process:", process.pid);
console.log("REDIS_URL:", process.env.REDIS_URL);


export const connection = new IOREDIS(process.env.REDIS_URL!, {
    maxRetriesPerRequest : null
})



connection.on("connect", () => {
  console.log("Redis connected");
});

connection.on("ready", () => {
  console.log("Redis ready");
});

connection.on("error", (err) => {
  console.error("Redis error:", err);
});