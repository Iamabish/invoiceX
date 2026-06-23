import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import {formatCurrency, formatDate} from "@/app/utils/helper"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Download,
  Mail,
  Trash2,
  User,
  Building2,
  Phone,
  MapPin,
  ReceiptText,
} from "lucide-react";

const InvoiceDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    notFound();
  }

  const invoice = await prisma.invoice.findUnique({
    where: {
      id,
    },
    select: {
      invoiceNumber: true,
      issueDate: true,
      dueDate: true,
      status: true,
      tax: true,
      total: true,
      subTotal: true,
      invoiceItems: {
        select: {
          description: true,
          quantity: true,
          unitPrice: true,
        },
      },
      client: {
        select: {
          name: true,
          email: true,
          phone: true,
          address: true,
          company: true,
        },
      },
    },
  });

  if (!invoice) {
    notFound();
  }



  const badgeVariant = () => {
    switch (invoice.status) {
      case "PAID":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "SENT":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "OVERDUE":
        return "bg-red-50 text-red-700 border-red-200";
      
      default:
        return "bg-zinc-100 text-zinc-700 border-zinc-200";
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">


      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <div className="flex items-center gap-3">

            <h1 className="text-3xl font-bold tracking-tight">
              {invoice.invoiceNumber}
            </h1>

            <Badge
              className={`rounded-full border px-4 py-1 ${badgeVariant()}`}
            >
              {invoice.status}
            </Badge>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Review invoice details, client information and payment summary.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">

          <Button variant="outline" className="gap-2 rounded-xl">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>

          <Button className="gap-2 rounded-xl">
            <Mail className="h-4 w-4" />
            Send Invoice
          </Button>

          {invoice.status === "DRAFT" && (
            <Button
              variant="destructive"
              className="gap-2 rounded-xl"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          )}
        </div>
      </div>


      <div className="grid gap-6 lg:grid-cols-2">


        <div className="rounded-3xl border bg-card p-7 shadow-sm lg:sticky lg:top-8">

          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-2">
              <User className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h2 className="font-semibold text-lg">
                Client Information
              </h2>

              <p className="text-sm text-muted-foreground">
                Billing recipient
              </p>
            </div>
          </div>

          <div className="space-y-5">

            <div>
              <p className="text-xl font-semibold">
                {invoice.client.name}
              </p>

              <p className="text-sm text-muted-foreground">
                {invoice.client.email}
              </p>
            </div>

            {invoice.client.company && (
              <div className="flex items-start gap-3">
                <Building2 className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <span>{invoice.client.company}</span>
              </div>
            )}

            {invoice.client.phone && (
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <span>{invoice.client.phone}</span>
              </div>
            )}

            {invoice.client.address && (
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <span>{invoice.client.address}</span>
              </div>
            )}
          </div>
        </div>


        <div className="rounded-3xl border bg-card p-7 shadow-sm lg:sticky lg:top-8">

          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-2">
              <ReceiptText className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h2 className="font-semibold text-lg">
                Invoice Details
              </h2>

              
            </div>
          </div>

          <div className="space-y-6">

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Invoice Number
              </span>

              <span className="font-semibold">
                {invoice.invoiceNumber}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Issue Date
              </span>

              <span>{formatDate(invoice.issueDate)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Due Date
              </span>

              <span>{formatDate(invoice.dueDate)}</span>
            </div>

            <div className="border-t pt-6">

              <div className="flex items-center justify-between text-lg">
                <span className="font-medium">
                  Current Status
                </span>

                <Badge className={badgeVariant()}>
                  {invoice.status}
                </Badge>
              </div>

            </div>

          </div>

        </div>

      </div>

     <div className="rounded-3xl border bg-card shadow-sm">
        <div className="border-b px-7 py-5">
            <h2 className="text-lg font-semibold">Invoice Items</h2>
        </div>

        <div className="max-h-[420px] overflow-y-auto">
            <table className="w-full">
            <thead className="sticky top-0 z-10 bg-background border-b">
                <tr>
                <th className="px-6 py-4 text-left">Description</th>
                <th className="px-6 py-4 text-center">Qty</th>
                <th className="px-6 py-4 text-right">Unit Price</th>
                <th className="px-6 py-4 text-right">Amount</th>
                </tr>
            </thead>
            <tbody>
                {invoice.invoiceItems.map((item, index) => {
                const amount = item.quantity * item.unitPrice;

                return (
                    <tr key={index} className="border-b last:border-none transition-colors hover:bg-muted/40 " > 
                        <td className="px-6 py-5"> 
                            <p className="max-w-xl leading-6"> {item.description} </p>
                        </td> 
                        <td className="px-6 py-5 text-center"> 
                            {item.quantity} 
                        </td> 
                        <td className="px-6 py-5 text-right"> 
                            {formatCurrency(item.unitPrice)} 
                        </td> 
                        <td className="px-6 py-5 text-right font-semibold"> 
                            {formatCurrency(amount)} 
                        </td> 
                    </tr>
                );
                })}
            </tbody>
            </table>
        </div>
    </div>


      <div className="flex justify-end">
        <div className="w-full max-w-md rounded-3xl border bg-card p-7 shadow-sm">

          <h2 className="mb-6 text-lg font-semibold">
            Payment Summary
          </h2>

          <div className="space-y-5">

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Subtotal
              </span>

              <span className="font-medium">
                {formatCurrency(invoice.subTotal)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Tax
              </span>

              <span className="font-medium">
                {formatCurrency(invoice.tax)}
              </span>
            </div>

            <div className="border-t pt-5">

              <div className="flex items-center justify-between">

                <span className="text-lg font-semibold">
                  Total
                </span>

                <span className="text-2xl font-bold">
                  {formatCurrency(invoice.total)}
                </span>

              </div>

            </div>

          </div>

        </div>
      </div>

    </div>
  );
};



export default InvoiceDetailPage