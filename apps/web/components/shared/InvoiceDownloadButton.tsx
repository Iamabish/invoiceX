"use client"
import { Button } from '../ui/button'
import { Download } from 'lucide-react'

const InvoiceDownloadButton = ({id} : {id : string}) => {

    console.log('invoice downlaod button');
    

  return (
    <Button 
    onClick={() => window.open(`/api/invoices/${id}/download`)}
    variant="outline" 
    className="gap-2 rounded-xl" 
    >
    <Download className="h-4 w-4" />
         Download PDF
    </Button>
  )
}

export default InvoiceDownloadButton