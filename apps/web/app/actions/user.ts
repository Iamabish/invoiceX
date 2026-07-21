'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function updateProfile(data: {
  name: string
  image?: string
}) {
  try {
    await auth.api.updateUser({
      headers: await headers(),
      body: data,
    })

    return {
      success: true,
      message: 'Profile updated successfully.',
    }
  } catch (error: any) {
    console.error('Update Profile Error:', error)

    return {
      success: false,
      error: 'Something went wrong. Please try again in a moment.',
    }
  }
}

export async function changePassword(data: {
  currentPassword: string
  newPassword: string
}) {
  try {
    await auth.api.changePassword({
      headers: await headers(),
      body: {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        revokeOtherSessions: true,
      },
    })

    return {
      success: true,
      message: 'Password changed successfully.',
    }
  } catch (error: any) {
    console.error('Change Password Error:', error)

    const errorMessage =
      error?.body?.message?.toLowerCase() ||
      error?.message?.toLowerCase() ||
      ''

    const isPasswordError =
      errorMessage.includes('invalid') ||
      errorMessage.includes('incorrect') ||
      errorMessage.includes('password') ||
      error?.status === 401

    return {
      success: false,
      error: isPasswordError
        ? 'Current password is incorrect.'
        : 'Something went wrong. Please try again in a moment.',
    }
  }
}

export async function deleteAccount(data: {
  confirmPassword: string
}) {
  try {
    await auth.api.deleteUser({
      headers: await headers(),
      body: {
        password: data.confirmPassword,
      },
    })

    return {
      success: true,
      message: 'Account deleted successfully.',
    }
  } catch (error: any) {
    console.error('Delete Account Error:', error)

    const errorMessage =
      error?.body?.message?.toLowerCase() ||
      error?.message?.toLowerCase() ||
      ''

    const isPasswordError =
      errorMessage.includes('invalid') ||
      errorMessage.includes('incorrect') ||
      errorMessage.includes('password') ||
      error?.status === 401

    return {
      success: false,
      error: isPasswordError
        ? 'Password is incorrect.'
        : 'Something went wrong. Please try again in a moment.',
    }
  }
}