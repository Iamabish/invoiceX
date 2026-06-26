import { sendInvoice } from "@/app/actions/sendInvoice";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req : NextRequest) {

 try {

    const authHeader = req.headers.get("authorization")
    if(authHeader !== process.env.COR_SECRET) {
        return NextResponse.json({ eror : 'Unauthorized',status : 401,  success : false,})
    }


       const currDate = new Date()

       const startOfDay = new Date()
       startOfDay.setHours(0, 0, 0, 0)
       
       const endOfDay = new Date()
       endOfDay.setHours(23, 59, 59, 999)
   
       const invoices = await prisma.invoice.findMany({
           where :{
                dueDate : {
                    gte : startOfDay,
                    lte : endOfDay
                },
                reminderSentAt : null,
                status : "SENT"
            
           },
       })
   
       console.log('pending invoices', invoices);
   
   
       for(const item of invoices) {
            await sendInvoice(item.id)
            await prisma.invoice.update({
                where :{
                    id : item.id
                },
                data :{
                    reminderSentAt : currDate
                }
            })
       }

       await prisma.invoice.updateMany({
        where :{
            dueDate :{
                lt : startOfDay
            },
            status : 'SENT'
        },
        data :{
            status : "OVERDUE"
        }
       })


       return NextResponse.json({
        success : true,
        status : 200
       })

   
       
 } catch (error) {    
    console.log('CRON error', error);

       return NextResponse.json({
        success : false,
        status : 500
       })
 }

    
}