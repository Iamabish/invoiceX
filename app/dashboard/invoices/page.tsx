
import SearchToggle from "@/components/shared/SearchToggle";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {  Eye, Plus } from "lucide-react";
import { headers } from "next/headers";
import { PAYMENT_STATUS } from "@/app/generated/prisma";
import FilterToggle from "@/components/shared/FilterToggle";

const invoices = [
  {
    id: "INV-041",
    client: "Acme Corp",
    amount: "$3,200",
    due: "Jun 18",
    status: "Paid",
  },
  {
    id: "INV-040",
    client: "Studio Noir",
    amount: "$1,800",
    due: "Jun 22",
    status: "Sent",
  },
  {
    id: "INV-039",
    client: "Orbit Labs",
    amount: "$2,580",
    due: "Jun 10",
    status: "Overdue",
  },
];

const filters = ["All", "Sent", "Paid", "Overdue", "Processing" ];

const statusStyles = {
  PAID: "bg-emerald-100 text-emerald-700",
  SENT: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-amber-100 text-amber-700",
  OVERDUE: "bg-red-100 text-red-700",
};

const statusDots = {
  PAID: "bg-emerald-500",
  SENT: "bg-blue-500",
  PROCESSING: "bg-amber-500",
  OVERDUE: "bg-red-500",
};


type Props = {
  searchParams : Promise<{
    search? : string,
    page? : string,
    status? : string
  }>
}


const Invoice = async ({searchParams} : Props) => {

  
  

  const user = await auth.api.getSession({
    headers : await headers()
  })

  const {search, page, status} = await searchParams

  const limit = 10
  const currPage = Number(page) || 1
  const skip = (currPage - 1)  * limit

  const where : any = {
    userId : user?.user.id
  }

  if(search) {

    where.OR = [
        {
          client: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ];
  }

  if (status && status !== "All") {
    where.status = status.toUpperCase() as PAYMENT_STATUS;
  }

  
  const fetchInvoice = await prisma.invoice.findMany({
    where,
    skip,
    take : limit,
    orderBy :{
      createdAt : "desc"
    },
    select :{
      id : true,
      status : true,
      subTotal : true,
      tax : true,
      total : true,
      dueDate : true,
      createdAt : true,
      client :{
        select :{
          name : true
        }
      }}
    })

    const total = await prisma.invoice.count({
      where
    })

    const totalPages = Math.ceil(total / limit)



  console.log('fetched invoice', fetchInvoice);
  
  return (
    <section className="flex-1 space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
            Invoices
          </h1>
          
        </div>

        <button className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800">
          <Plus className="h-4 w-4" />
          New Invoice
        </button>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-200 p-6">
          <h2 className="text-lg font-semibold text-zinc-900">
            All Invoices
          </h2>

          <SearchToggle />
        </div>

        <FilterToggle />

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-zinc-200 bg-zinc-50">
              <tr className="text-left text-sm text-zinc-500">
                <th className="px-6 py-4 font-medium">Invoice</th>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">SubTotal</th>
                <th className="px-6 py-4 font-medium">Tax</th>
                <th className="px-6 py-4 font-medium">Due Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>

            <tbody>
              {fetchInvoice.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-zinc-500"
                  >
                    No invoices found.
                  </td>
                </tr>
              ) : (
                fetchInvoice.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-zinc-100 transition hover:bg-zinc-50"
                  >
                    <td className="px-6 py-5 font-medium text-zinc-900">
                      #{invoice.id.slice(0, 8)}
                    </td>

                    <td className="px-6 py-5 text-zinc-700">
                      {invoice.client.name}
                    </td>

                    <td className="px-6 py-5 font-medium text-zinc-900">
                      ₹{invoice.total.toLocaleString()}
                    </td>

                    <td className="px-6 py-5 text-zinc-700">
                      ₹{invoice.subTotal.toLocaleString()}
                    </td>

                    <td className="px-6 py-5 text-zinc-700">
                      ₹{invoice.tax.toLocaleString()}
                    </td>

                    <td className="px-6 py-5 text-zinc-600">
                      {invoice.dueDate.toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                          statusStyles[invoice.status as keyof typeof statusStyles]
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            statusDots[invoice.status as keyof typeof statusDots]
                          }`}
                        />
                        {invoice.status}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-right">
                      <button className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700 transition hover:bg-zinc-100">
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-zinc-200 p-6">
          <p className="text-sm text-zinc-500">
            24 invoices total
          </p>

          <div className="flex gap-2">
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition ${
                  page === 1
                    ? "bg-black text-white"
                    : "border border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Invoice;
