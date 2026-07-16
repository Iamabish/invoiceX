'use server'

import { InvoiceFormValues, LineItem } from "@/components/shared/InvoiceFormClient"
import { auth } from "@/lib/auth"
import {prisma} from "@invoicex/db";

import { headers } from "next/headers"

export async function createInvoice(data: InvoiceFormValues) {
  try {
    const user = await auth.api.getSession({
      headers: await headers(),
    });

    if (!user?.user) {
      throw new Error('Unauthorized Request');
    }

    console.log('user at create invoice', user.user.id);

    const issueDate = data.issueDate;
    const dueData = data.dueDate;
    const taxRate = data.taxRate;
    const notes = data.notes;
    const items = data.items;

    if (Number(taxRate) < 0 || Number(taxRate) > 100) {
      throw new Error('Invalid tax Rate');
    }

    const isValidClient = await prisma.client.findFirst({
      where: {
        userId: user.user.id,
        id: data.clientId,
      },
    });

    if (!isValidClient) {
      throw new Error('Invalid Client');
    }

    if (items.length === 0) {
      throw new Error('Invalid Request');
    }

    const isValidItem = items.every((item) => item.quantity > 0 && item.unitPrice >= 0);

    if (!isValidItem) {
      throw new Error('Invalid item');
    }

    const subTotal = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
    const tax = Math.round(subTotal * (Number(taxRate) / 100));
    const total = tax + subTotal;

    const invoice = await prisma.$transaction(async (tsx) => {
      const invoiceCount = await tsx.invoice.count({ where: { userId: user.user.id } });
      const generatedInvNumber = `INV-${String(invoiceCount + 1).padStart(4, '0')}`;

      const newInvoice = await tsx.invoice.create({
        data: {
          total,
          invoiceNumber: generatedInvNumber,
          subTotal,
          tax,
          issueDate: new Date(issueDate),
          notes,
          dueDate: new Date(dueData),
          status: 'DRAFT',
          userId: user.user.id,
          clientId: data.clientId,
        },
        select :{
          id : true
        }
      });

      await tsx.invoiceItem.createMany({
        data: items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          invoiceId: newInvoice.id,
        })),
      });

      return newInvoice
    });

    return invoice;
  } catch (error) {
    console.log('Create invoice error', error);
    throw error;
  }
}