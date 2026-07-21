'use server'

import { auth } from "@/lib/auth";
import { authRateLimit } from "@/lib/rateLimit";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signUp(formData: FormData) {
  try {


   const headersList = await headers();
    const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

    const { success } = await authRateLimit.limit(ip);
    if (!success) {
      return {
        success: false,
        message: "Too many attempts. Please try again in a few minutes.",
      };
    }

     
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

  } catch (error: any) {
    console.error("Signup Error:", error);

    return {
      success: false,
      message:
        error?.body?.message ||
        error?.message ||
        "Failed to create account.",
    };
  }

  redirect("/");
}

"use server";


export async function signIn(formData: FormData) {
  try {
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

    const { success } = await authRateLimit.limit(ip);
    if (!success) {
      return {
        success: false,
        message: "Too many attempts. Please try again in a few minutes.",
      };
    }

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    await auth.api.signInEmail({
      body: { email, password },
    });

  } catch (error: any) {
    console.error("Signin Error:", error);

    return {
      success: false,
      message:
        error?.body?.message ||
        error?.message ||
        "Invalid email or password.",
    };
  }

  redirect("/dashboard");
}

export async function logout() {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
  } catch (error) {
    console.error("Logout Error:", error);

    return {
      success: false,
      message: "Failed to logout.",
    };
  }

  redirect("/");
}