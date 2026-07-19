'use server'

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signUp(formData: FormData) {
  try {
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

export async function signIn(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
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