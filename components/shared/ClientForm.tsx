"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ClientType } from "./ClientAction";

import ClientFormFields from "./ClientFormFields";

interface ClientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: ClientType;
}

export default function ClientForm({
  open,
  onOpenChange,
  client
}: ClientFormProps) {

    const isEditing = !!client;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
 <DialogContent className="!w-[95vw] !max-w-5xl p-0 overflow-hidden">
        <DialogHeader className="border-b border-zinc-200 px-8 py-6">
          <DialogTitle className="text-2xl font-semibold tracking-tight">
                {isEditing ? "Edit Client" : "Add Client"}
          </DialogTitle>

          <DialogDescription className="mt-2 text-sm text-zinc-500">
            Add a client to start creating invoices and tracking payments.
          </DialogDescription>
        </DialogHeader>

       <ClientFormFields
            client={client}
            onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}