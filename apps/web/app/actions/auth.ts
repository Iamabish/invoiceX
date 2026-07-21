'use server'

import { auth } from '@/lib/auth'
import { authRateLimit } from '@/lib/rateLimit'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function signUp(formData: FormData) {
try {
  const headersList = await headers()
  const ip =
  headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
  'unknown'

  const { success } = await authRateLimit.limit(ip)

  if (!success) {
    return {
      success: false,
      message:
        'Too many attempts. Please try again in a few minutes.',
    }
  }

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
  })

} catch (error: any) {
  console.error('Signup Error:', error)

  const errorMessage =
    error?.body?.message?.toLowerCase() ||
    error?.message?.toLowerCase() ||
    ''

  const isDuplicateEmail =
    errorMessage.includes('already') ||
    errorMessage.includes('exists') ||
    errorMessage.includes('duplicate') ||
    error?.status === 409

  return {
    success: false,
    message: isDuplicateEmail
      ? 'An account with this email already exists.'
      : 'Something went wrong. Please try again in a moment.',
  }

  }

  redirect('/dashboard')
}

export async function signIn(formData: FormData) {
  try {
    const headersList = await headers()
    const ip =
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
    const { success } = await authRateLimit.limit(ip)

    if (!success) {
      return {
        success: false,
        message:
          'Too many attempts. Please try again in a few minutes.',
      }
    }

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    await auth.api.signInEmail({
      body: { email, password },
    })

  } catch (error: any) {
  console.error('Signin Error:', error)

  const errorMessage =
    error?.body?.message?.toLowerCase() ||
    error?.message?.toLowerCase() ||
    ''

  const isAuthError =
    errorMessage.includes('invalid') ||
    errorMessage.includes('credential') ||
    errorMessage.includes('password') ||
    errorMessage.includes('email') ||
    error?.status === 401

  return {
    success: false,
    message: isAuthError
      ? 'Invalid email or password.'
      : 'Something went wrong. Please try again in a moment.',
  }

  }

  redirect('/dashboard')
}

export async function logout() {
  try {
      await auth.api.signOut({
      headers: await headers(),
      })
    } catch (error) {
      console.error('Logout Error:', error)

      return {
        success: false,
        message: 'Failed to logout.',
      }

    }

  redirect('/')
}
