'use server'

import { InvoiceFormValues } from '@/components/shared/InvoiceFormClient'
import { auth } from '@/lib/auth'
import { prisma } from '@invoicex/db'
import { emailQueue } from '@invoicex/redis'
import { headers } from 'next/headers'


  export async function sendInvoice(invoiceId: string) {
    try {
      const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return {
      success: false,
      error: 'Unauthorized',
    }
    }

    await emailQueue.add('send-invoice-email', {
      invoiceId,
      userId: session.user.id,
    })

    return {
      success: true,
      message: 'Invoice queued for delivery',
    }
    } catch (err) {
      console.error('Send invoice error:', err)

      return {
      success: false,
      error:
      err instanceof Error
      ? err.message
      : 'Failed to send invoice',
      }
    }
  }


  export async function createInvoice(data: InvoiceFormValues) {
  try {
    const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return {
    success: false,
    error: 'Unauthorized',
    }
  }

  if (Number(data.taxRate) < 0 || Number(data.taxRate) > 100) {
    return {
    success: false,
    error: 'Tax rate must be between 0 and 100',
    }
  }

  const isValidClient = await prisma.client.findFirst({
    where: {
      id: data.clientId,
      userId: session.user.id,
    },
    select: {
      id: true,
    },
  })

  if (!isValidClient) {
    return {
      success: false,
      error: 'Invalid client selected',
    }
  }

  if (data.items.length === 0) {
    return {
      success: false,
      error: 'At least one item is required',
    }
  }

  const isValidItems = data.items.every(
    (item) => item.quantity > 0 && item.unitPrice >= 0
  )

  if (!isValidItems) {
    return {
      success: false,
      error: 'Invalid item data',
    }
  }

  const subTotal = data.items.reduce(
    (acc, item) => acc + item.quantity * item.unitPrice,
    0
  )

  const tax = Math.round(subTotal * (Number(data.taxRate) / 100))
  const total = subTotal + tax

  const invoice = await prisma.$transaction(async (tx) => {
    const invoiceCount = await tx.invoice.count({
      where: {
      userId: session.user.id,
      },
    })

  const invoiceNumber = `INV-${String(invoiceCount + 1).padStart(4, '0')}`

    const newInvoice = await tx.invoice.create({
      data: {
        invoiceNumber,
        userId: session.user.id,
        clientId: data.clientId,
        subTotal,
        taxRate: Number(data.taxRate),
        tax,
        total,
        issueDate: new Date(data.issueDate),
        dueDate: new Date(data.dueDate),
        notes: data.notes,
        status: 'DRAFT',
        },
        select: {
        id: true,
        invoiceNumber: true,
      },
    })

  await tx.invoiceItem.createMany({
    data: data.items.map((item) => ({
    description: item.description,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    invoiceId: newInvoice.id,
    })),
  })

    return newInvoice
  })

    return {
      success: true,
      message: 'Invoice created successfully',
      data: invoice,
    }
  } catch (err) {
    console.error('Create invoice error:', err)

    return {
      success: false,
      error:
      err instanceof Error
      ? err.message
      : 'Failed to create invoice',
    }
  }
  }


  export async function deleteInvoice(invoiceId: string) {
  try {
    const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return {
      success: false,
      error: 'Unauthorized',
    }
  }

  const invoice = await prisma.invoice.findUnique({
  where: {
      userId_id: {
        userId: session.user.id,
        id: invoiceId,
      },
    },
    select: {
      id: true,
    },
  })

  if (!invoice) {
    return {
      success: false,
      error: 'Invoice not found',
    }
  }

  await prisma.invoice.delete({
    where: {
      id: invoice.id,
    },
  })

  return {
    success: true,
    message: 'Invoice deleted successfully',
    }
  } catch (err) {
  console.error('Delete invoice error:', err)

  return {
      success: false,
      error:
      err instanceof Error
      ? err.message
      : 'Failed to delete invoice',
    }
  }
}
