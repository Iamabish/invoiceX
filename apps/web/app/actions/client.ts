'use server'

import { auth } from '@/lib/auth'
import { Prisma, prisma } from '@invoicex/db'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

export async function addClient(formData: FormData) {
  try {
    const user = await auth.api.getSession({
      headers: await headers(),
    })

    if (!user?.user) {
      return {
        success: false,
        error: 'Unauthorized',
      }
    }

    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const company = formData.get('company') as string
    const phone = formData.get('phone') as string
    const address = formData.get('address') as string

    const client = await prisma.client.create({
      data: {
        name,
        email,
        company,
        phone,
        address,
        userId: user.user.id,
      },
    })

    revalidatePath('/dashboard/clients')

    return {
      success: true,
      message: 'Client created successfully',
      data: client,
    }
  } catch (error: any) {
    console.error('Create Client Error:', error)

    const errorMessage =
      error?.message?.toLowerCase() || ''

    const isDuplicateEmail =
      errorMessage.includes('unique') ||
      errorMessage.includes('duplicate') ||
      errorMessage.includes('already')

    return {
      success: false,
      error: isDuplicateEmail
        ? 'A client with this email already exists.'
        : 'Something went wrong. Please try again in a moment.',
    }
  }
}

export async function editClient(clientId: string, formData: FormData) {
  try {
    const user = await auth.api.getSession({
      headers: await headers(),
    })

    if (!user?.user) {
      return {
        success: false,
        error: 'Unauthorized',
      }
    }

    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const company = formData.get('company') as string
    const phone = formData.get('phone') as string
    const address = formData.get('address') as string

    const isClient = await prisma.client.findFirst({
      where: {
        id: clientId,
        userId: user.user.id,
      },
      select: {
        id: true,
      },
    })

    if (!isClient) {
      return {
        success: false,
        error: 'Client not found',
      }
    }

    const client = await prisma.client.update({
      where: {
        id: isClient.id,
      },
      data: {
        name,
        email,
        company,
        phone,
        address,
      },
    })

    revalidatePath('/dashboard/clients')

    return {
      success: true,
      message: 'Client updated successfully',
      data: client,
    }
  } catch (error: any) {
    console.error('Edit Client Error:', error)

    const errorMessage =
      error?.message?.toLowerCase() || ''

    const isDuplicateEmail =
      errorMessage.includes('unique') ||
      errorMessage.includes('duplicate') ||
      errorMessage.includes('already')

    return {
      success: false,
      error: isDuplicateEmail
        ? 'Another client is already using this email.'
        : 'Something went wrong. Please try again in a moment.',
    }
  }
}

export async function deleteClient(clientId: string) {
  try {
    const user = await auth.api.getSession({
      headers: await headers(),
    })

    if (!user?.user) {
      return {
        success: false,
        error: 'Unauthorized',
      }
    }

    const isClient = await prisma.client.findFirst({
      where: {
        id: clientId,
        userId: user.user.id,
      },
      select: {
        id: true,
      },
    })

    if (!isClient) {
      return {
        success: false,
        error: 'Client not found',
      }
    }

    await prisma.client.delete({
      where: {
        id: isClient.id,
      },
    })

    revalidatePath('/dashboard/clients')

    return {
      success: true,
      message: 'Client deleted successfully',
      data: null,
    }
  } catch (error: any) {
    console.error('Delete Client Error:', error)

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      return {
        success: false,
        error:
          'Cannot delete this client because invoices are associated with it. Delete the invoices first.',
      }
    }

    return {
      success: false,
      error: 'Something went wrong. Please try again in a moment.',
    }
  }
}