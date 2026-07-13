"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Resend } from "resend";
import {Queue} from "bullmq"
import {connection} from "@invoicex/redis"
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInvoice(invoiceId: string) {


  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const invoiceQueue = new Queue("email-queue", { connection })


  await invoiceQueue.add('email-queue', {
    invoiceId : invoiceId,
    userId : session.user.id
  })
  
  return {
    success: true,
  };
}