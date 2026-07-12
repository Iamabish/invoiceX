"use client";

import { sendInvoice } from "@/app/actions/sendInvoice"
import { Button } from '../ui/button';
import { Send } from "lucide-react";

const SendInvoiceClientButton = ({invoiceId} : {invoiceId : string}) => {
  return <Button
  onClick={async () => {
    await sendInvoice(invoiceId);
  }}
>
    <Send  className="h-4 w-4"/>
  Send Invoice
</Button>
}

export default SendInvoiceClientButton





