"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const NewInvoiceClientButton = () => {
  const router = useRouter();

  return (
    <Button
    variant="ghost"
      onClick={() => router.push("/dashboard/invoices/new")}
      className="w-full btn-primary py-3 text-sm disabled:opacity-60 sm:w-auto"
    >
      <Plus className="h-4 w-4" />
      New Invoice
    </Button>
  );
};

export default NewInvoiceClientButton;