import { Worker } from "bullmq";
import { connection } from "@invoicex/redis";
import { prisma } from "@invoicex/db";
import generatePDF from "./generatePDF";
import {resend} from "./resend"
import { EmailTemplate } from "./email/email-template";
import React from "react"

const emailWorker = new Worker("email-queue",async (job) => {
    // Process the job

    const invoiceId = await job.data.id
    const userId = await job.data.userId


   const invoice = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      userId: userId
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

  if(!invoice) {
    throw Error('Failed to find invoice')
  }

  const pdf = await generatePDF(invoice);

  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",

    to: 'abhishsomk11@gmail.com',

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
    console.log('send invoice error',error );
    
    throw new Error(error.message);
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
  
})


// emailWorker.on('completed', (job) => {
//   metrics.histogram('job.duration', job.processedOn! - job.timestamp, {
//     queue: 'email', name: job.name,
//   });
// });

// emailWorker.on('failed', () => {
//   metrics.increment('job.failed', { queue: 'email' });
// });