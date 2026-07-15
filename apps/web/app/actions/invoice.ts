'use server'

import { InvoiceFormValues, LineItem } from "@/components/shared/InvoiceFormClient"
import { auth } from "@/lib/auth"
import {prisma} from "@invoicex/db";

import { headers } from "next/headers"

export async function createInvoice( data: InvoiceFormValues) {

    
    try {
        const user = await auth.api.getSession({
            headers : await headers()
        })
    
        if(!user?.user) {
            throw new Error('Unauthorized Request')
        }

        console.log('user at incovice',user.user.id);
        
        const issueDate =  data.issueDate
        const dueData = data.dueDate
        const taxRate = data.taxRate
        const notes = data.notes
        const items = data.items
      
    
      if(Number(taxRate) < 0 || Number(taxRate) > 100 ) {
        throw new Error("Invalid tax Rate")
      }
    
    
      const isValidClient = await prisma.client.findFirst({
        where :{
            userId : user?.user?.id,
            id : data.clientId
        }
      })

      
    
      if(!isValidClient) {
        throw new Error('Invalid Client')
      }
    
      if(items.length === 0) {
        throw new Error('Invalid Request')
      }
    
      const isValidItem = items.every((item) => item.quantity > 0 && item.unitPrice >= 0)
    
      if(!isValidItem) {
        throw new Error('Invalid item')
      }
    
      const subTotal = items.reduce((acc, item) => {
        return (acc + item.quantity * item.unitPrice)
      }, 0)
    
      const tax = Math.round(subTotal  * (Number(taxRate)/ 100))
    
      const total = tax + subTotal
    
      const final_order = await prisma.$transaction(async (tsx : any)=> {
    
        const invoiceCount = await tsx.invoice.count({where : {userId : user.user.id}})
        console.log('invoice count ', invoiceCount);
        
        const generatedInvNumber = `INV-${String(invoiceCount + 1).padStart(4, '0')}`

        console.log('generated inv number ', generatedInvNumber);
        
    
        const invoice = await tsx.invoice.create({
            data :{
                total : total,
                invoiceNumber : generatedInvNumber,
                subTotal : subTotal,
                tax : tax,
                issueDate : new Date(issueDate),
                notes : notes,
                dueDate : new Date(dueData),
                status : "DRAFT",
                userId : user.user.id,
                clientId : data.clientId,
            },
            
        })
    
       for(const item of items) {
        await tsx.invoiceItem.createMany({
            data :{
                description : item.description,
                quantity : item.quantity,
                unitPrice :item.unitPrice,
                invoiceId : invoice.id
            }
        })
       }

       return invoice
       
      })

      console.log('final order', final_order);

    } catch (error) {

        console.log('Create invoice error', error);
        throw error

    }
}