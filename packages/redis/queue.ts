import { Queue } from 'bullmq';
import { connection } from  "./connection"


const globalForQueues = globalThis as unknown as {
  emailQueue: Queue;
};

export const emailQueue =
  globalForQueues.emailQueue ?? new Queue('email-queue', { connection });
    

if (process.env.NODE_ENV !== 'production') {
  globalForQueues.emailQueue = emailQueue;
}