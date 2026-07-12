import { prisma } from "@invoicex/db"
import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
export  async function GET(req : NextRequest,

    { params } : {params : Promise<{id : string}>}
) {

    const { id } = await params

    console.log('at create session route');
    console.log('id', id);    


    try {

        const invoice = await prisma.invoice.findUnique({
            where : {
                id : id,
            }
        })

        if(!invoice) {
            return NextResponse.json({msg : 'Invalid Request', status : 404})
        }


       if(invoice.status === "PAID") {
        return NextResponse.json({msg : 'Invoice is already paid', status : 404})
       }

       const session = await stripe.checkout.sessions.create({
        payment_method_types : ["card"],
        line_items : [
            {
                price_data : {
                    currency : 'usd',
                    product_data : {
                        name : `Invoice ${invoice.invoiceNumber}`
                    },
                    unit_amount : invoice.total
                },
                quantity : 1
                
            },
        
        ],
        metadata : {invoiceId : invoice.id},
        mode: "payment",
          success_url:  `${process.env.APP_URL}/success`,
          cancel_url: `${process.env.APP_URL}/cancel`,
       })

       return NextResponse.redirect(session.url!)

    }catch(err) {
        console.log('Error at pay handler', err);    
    }
}