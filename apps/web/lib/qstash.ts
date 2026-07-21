import { Client } from "@upstash/qstash"


export const qstash = new Client({
  token: process.env.QSTASH_TOKEN!,
});


console.log('qstash', qstash.messages);
