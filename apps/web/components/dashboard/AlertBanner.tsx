import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@invoicex/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function AlertBanner() {


    const user = await auth.api.getSession({
        headers : await headers()
      })


    const invoiceCount = await prisma.invoice.count({where : {userId : user?.user.id, status : "OVERDUE"}})

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 md:flex-row md:items-center md:justify-between">

      <div className="flex items-start gap-3">

        <div className="rounded-lg bg-amber-100 p-2">
          <TriangleAlert className="h-5 w-5 text-amber-700" />
        </div>

        <div>
          <h3 className="font-semibold">
            {invoiceCount} invoices need your attention
          </h3>

          <p className="text-sm text-muted-foreground">
            They are overdue and waiting for payment.
          </p>
        </div>

      </div>

      <Button
        variant="outline"
        className="rounded-xl"
      >
        View invoices
      </Button>

    </div>
  );
}