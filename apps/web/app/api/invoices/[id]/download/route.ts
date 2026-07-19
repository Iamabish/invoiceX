import { prisma } from "@invoicex/db"

import { NextRequest, NextResponse } from "next/server";
import { generatePDF } from "@invoicex/pdf"

export async function GET(req  : NextRequest, 
   { params } :  { params : Promise<{id : string}> }
) {


    console.log('at get req for download  pdf');
    
    
    const { id }  = await params

    console.log('id ', id);
    
  
    const invoice = await prisma.invoice.findUnique({
        where: {
            id,
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
            return NextResponse.json({
                msg : 'Invoice not found',
                status : 404
            })
        }

    const pdf = await generatePDF(invoice)

    return new NextResponse(pdf.buffer as ArrayBuffer, {
        headers : {
            "Content-Type" : "application/pdf",
            "Content-Disposition" : 'attachment; filename="invoice.pdf"'
        }
    })

    
}