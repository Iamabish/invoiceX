"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import  { emailQueue } from "@invoicex/redis"

export async function sendInvoice(invoiceId: string) {

try {
    console.log('at sendinvoice');
  
    console.log('sendinvoice id', invoiceId);
      
  
    const session = await auth.api.getSession({
      headers: await headers(),
    });
  
    const userId = session?.user.id
  
    console.log('userid', userId);
    
  
    if (!session?.user) {
      throw new Error("Unauthorized");
    }
  
    
    const job = await emailQueue.add('send-invoice-email', {
      invoiceId,
      userId
    })


    console.log('created job', job.id);
    
  
    return {
      success: true,
    };



} catch (error) {

  console.log('Error ar send invoice', error);
  
  
}
}