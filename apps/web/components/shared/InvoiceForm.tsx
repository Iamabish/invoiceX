import { auth } from "@/lib/auth"
import {prisma} from "@invoicex/db"
import { headers } from "next/headers"
import InvoiceFormClient from "./InvoiceFormClient"



const InvoiceForm = async () => {

    const user = await auth.api.getSession({
        headers : await headers()
    })

    const clients = await prisma.client.findMany({
        where :{
            userId : user?.user.id,
        },
        select :{
            name : true,
            id : true
        }
    })

    console.log('client with draft invoice', clients);



  return (
    <div>InvoiceForm
        <InvoiceFormClient clients={clients} />
    </div>
  )
}

export default InvoiceForm