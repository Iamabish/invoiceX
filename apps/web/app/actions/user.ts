"use server"


import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function updateProfile(data: {
  name: string;
  image?: string;
}) {
  try {
    await auth.api.updateUser({
      headers: await headers(),
      body: data,
    });

    return {
      success: true,
    };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Something went wrong.",
    };
  }
}

export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}) {
 try {
     await auth.api.changePassword({
       headers: await headers(),
       body: {
         currentPassword: data.currentPassword,
         newPassword: data.newPassword,
         revokeOtherSessions: true,
       },
     });


      return {
      success: true,
    };


 }  catch (err) {
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Something went wrong.",
    };
  }
}

export async function deleteAccount(data: {
  confirmPassword : string
}) {
 try {
     await auth.api.deleteUser({
        headers : await headers(),
        body :{
            password : data.confirmPassword
        }
     })
      return {
      success: true,
    };
 }  catch (err) {
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Something went wrong.",
    };
  }
}
