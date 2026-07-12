import InvoiceForm from "@/components/shared/InvoiceForm"
import InvoiceFormClient from "@/components/shared/InvoiceFormClient";
import { ArrowLeft, FilePlus } from "lucide-react";

import { auth } from "@/lib/auth"
import {prisma} from "@invoicex/db"

import { headers } from "next/headers"

const InvoiceFormPage = async () => {


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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-ix-teal-pale rounded-xl flex items-center justify-center">
            <FilePlus className="w-5 h-5 text-ix-teal" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl font-medium text-ix-dark">New Invoice</h1>
            <p className="text-sm text-ix-charcoal">Create and send a professional invoice</p>
          </div>
        </div>
      </div>

      <InvoiceFormClient clients={clients}/>
    </div>
  );
}

export default InvoiceFormPage


