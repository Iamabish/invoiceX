import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@invoicex/db"

export  async function POST(req : NextRequest) {

    console.log('inside post webhook');

    console.log('webhook secret', process.env.STRIPE_WEBHOOK_SECRET);
    
  
    const body =  await req.text()

    const signature = req.headers.get('stripe-signature')
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature!,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      if(event.type === "checkout.session.completed") {

        console.log('inside checkout session completed');
        
        const incoviceId = event.data.object.metadata?.invoiceId

        console.log('invoice Id ', incoviceId);
        
        await prisma.invoice.update({
            where :{
                id : incoviceId
            },
            data :{
                status : "PAID",
                paidAt : new Date()
            }
        })  
      }

      return NextResponse.json({
        success : true,
        status : 200
      })
    } catch (err : any) {
      console.log(`Webhook signature verification failed.`, err.message);
      return NextResponse.json({success : false, status : 500, msg : 'Internal server error'});
    }
}