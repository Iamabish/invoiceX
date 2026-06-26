"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/email/email-template";
import generatePDF from "@/app/utils/generatePDF";
import React from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInvoice(invoiceId: string) {


  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const invoice = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      userId: session.user.id,
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

  if (!invoice) {
    throw new Error("Invoice not found");
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

  return {
    success: true,
    data,
  };
}