import { Worker } from "bullmq";
import { connection } from "@invoicex/redis";
import { prisma } from "@invoicex/db";
import generatePDF from "./generatePDF";
import {resend} from "./resend"
import { EmailTemplate } from "./email/email-template";
import React from "react"



const emailWorker = new Worker("email-queue",async (job) => {

  console.log('worker live');
  console.log(job.id);
  
  

  switch (job.name) {

    case "send-invoice-email": {

      console.log('at send case');

    try {
      
          const invoiceId = job.data.invoiceId;
          const userId = job.data.userId;
      
      
          console.log('invoice id', invoiceId);
          console.log('userid ', userId);
      
          console.log('app url', process.env.APP_URL);
          
      
          const invoice = await prisma.invoice.findFirst({
            where: {
              id: invoiceId,
              userId,
            },
            select: {
              invoiceNumber: true,
              issueDate: true,
              dueDate: true,
              status: true,
              taxRate: true,
              tax: true,
              subTotal: true,
              total: true,
              notes: true,
      
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
      
              client: {
                select: {
                  name: true,
                  email: true,
                  phone: true,
                  address: true,
                  company: true,
                },
              },
      
              invoiceItems: {
                select: {
                  description: true,
                  quantity: true,
                  unitPrice: true,
                },
              },
            },
          });
      
      
          console.log('invoice ', invoice);
      
              if (!invoice) {
                throw new Error("Failed to find invoice");
              }

              if (invoice.status === "SENT") {
                console.log("Invoice already sent");
                return;
              }
      
          const pdf = await generatePDF(invoice);
      
          const { data, error } = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: "abhishsomk11@gmail.com",
            subject: `Invoice ${invoice.invoiceNumber}`,
      
            react: React.createElement(EmailTemplate, {
              clientName: invoice.client.name,
              senderName: invoice.user.name,
              senderEmail: invoice.user.email,
              invoiceNumber: invoice.invoiceNumber,
              issueDate: invoice.issueDate.toLocaleDateString(),
              dueDate: invoice.dueDate.toLocaleDateString(),
              total: String(invoice.total),
              payUrl: `${process.env.APP_URL}/api/invoices/${invoiceId}/pay`,
            }),
      
            attachments: [
              {
                filename: `${invoice.invoiceNumber}.pdf`,
                content: Buffer.from(pdf.buffer),
              },
            ],
          });
      
          console.log("resend data", data);
          console.log("resend error", error);
      
          if (error) {
            console.log("send invoice error", error);
            throw new Error(error.message);
          }
      
      
          await prisma.invoice.update({
            where : {
              id : invoiceId
            },
            data :{
              status : "SENT",
              sentAt : new Date()
            }
          })

    } catch (error) {
    
      console.log('Worker error', error);  
      throw error
    }

      break;
    }

  default:
    throw new Error(`Unknown job: ${job.name}`);
}

  },
  {
    connection,
    concurrency : 5,
    limiter :{
      max : 100,
      duration : 60 * 1000
    }
  }
);

emailWorker.on("failed", (job, err) => {

  console.log('error', err);
  console.log('job', job?.name);
  
  
  
})


// emailWorker.on('completed', (job) => {
//   metrics.histogram('job.duration', job.processedOn! - job.timestamp, {
//     queue: 'email', name: job.name,
//   });
// });

// emailWorker.on('failed', () => {
//   metrics.increment('job.failed', { queue: 'email' });
// });