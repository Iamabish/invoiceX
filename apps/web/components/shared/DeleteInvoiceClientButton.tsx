'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { deleteInvoice } from '@/app/actions/invoice'
import { Button } from '../ui/button'

interface DeleteInvoiceClientButtonProps {
  invoiceId: string
}

const DeleteInvoiceClientButton = ({
  invoiceId,
}: DeleteInvoiceClientButtonProps) => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setLoading(true)

    try {
      const result = await deleteInvoice(invoiceId)

      if (result.success) {
        toast.success(result.message)

        router.push('/dashboard/invoices')
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleDelete}
      disabled={loading}
      variant="destructive"
      className="gap-2 rounded-2xl"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Deleting...
        </>
      ) : (
        <>
          <Trash2 className="h-4 w-4" />
          Delete
        </>
      )}
    </Button>
  )
}

export default DeleteInvoiceClientButton