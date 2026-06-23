"use server"
import ClientForm from "@/components/shared/ClientForm"
import InvoiceForm from "@/components/shared/InvoiceForm"
import InvoiceFormClient from "@/components/shared/InvoiceFormClient"
import InvoiceDetailPage from "./invoices/[id]/page"

const Dashboard = async () => {
  return (
    <>
        this is dashboard
        {/* <Search /> */}

        {/* <InvoiceForm /> */}

        {/* <InvoiceDetailPage params={Promise.resolve({
            id : '0b66f322-61e6-4525-bbd0-bcdf8564b85d'
        })}/> */}
    </>
  )
}

export default Dashboard