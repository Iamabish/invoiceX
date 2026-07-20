import { EmailTemplate } from "@/app/templates/email/email-template";
import { prisma } from "@invoicex/db";
import { generatePDF } from "@/app/utils/generatePDF"
import { resend } from "@/lib/resend";
import { NextRequest, NextResponse } from "next/server";
import React from "react";

export async function POST(req : NextRequest) {
    try {
      
         const { invoiceId, userId } = await req.json();
      
      
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


          return NextResponse.json({ success: true });

    } catch (error) {
    
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Unknown error" },
        { status: 500 }
        );
    }

}


