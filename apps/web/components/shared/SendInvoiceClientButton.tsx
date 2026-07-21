'use client'

import {  MouseEvent, useState } from 'react'
import { toast } from 'sonner'
import { Send, Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import { sendInvoice } from '@/app/actions/invoice'

export default function SendInvoiceClientButton({
  invoiceId,
}: {
  invoiceId: string
}) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e :  MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    setLoading(true)

    console.log('handle invoice click');
    

    const result = await sendInvoice(invoiceId)

    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.error)
    }

    setLoading(false)
  }

  return (
    <Button onClick={handleSubmit} disabled={loading} type="button">
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Send className="h-4 w-4" />
      )}
      {loading ? 'Sending...' : 'Send Invoice'}
    </Button>
  )
}