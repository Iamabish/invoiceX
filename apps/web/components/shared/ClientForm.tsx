'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

import { ClientType } from './ClientAction'
import ClientFormFields from './ClientFormFields'
import { User } from 'lucide-react'

interface ClientFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client?: ClientType
}

export default function ClientForm({
  open,
  onOpenChange,
  client,
}: ClientFormProps) {
  const isEditing = !!client

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[95vw] !max-w-4xl overflow-hidden border border-ix-border bg-white p-0 shadow-2xl">
       <DialogHeader className="border-b border-ix-border bg-white px-8 py-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ix-teal-pale">
            <User className="h-5 w-5 text-ix-teal" strokeWidth={1.5} />
          </div>

          <div className="flex-1 space-y-1">
            <DialogTitle className="text-2xl font-semibold tracking-tight text-ix-dark">
              {isEditing ? 'Edit Client' : 'Add Client'}
            </DialogTitle>

            <DialogDescription className="text-sm text-ix-muted">
              {isEditing
                ? 'Update client details used for invoices and payment tracking.'
                : 'Add a client to start creating invoices and tracking payments.'}
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

        <div className="bg-white">
          <ClientFormFields
            client={client}
            onClose={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}