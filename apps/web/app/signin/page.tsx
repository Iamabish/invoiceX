"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "../actions/auth";
import { toast } from "sonner";


export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    try {
      const result = await signIn(formData);

      if (result?.success === false) {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-6 py-10">
      <Card className="relative w-full max-w-[420px] rounded-3xl border border-zinc-800 bg-zinc-900/90 shadow-2xl backdrop-blur">
        <CardContent className="space-y-6 p-6">
          <div className="flex justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white font-bold text-black shadow-lg">
              I
            </div>
          </div>

          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Welcome back
            </h1>
            <p className="text-sm text-zinc-400">
              Sign in to continue managing your invoices.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">
                Email
              </Label>

              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                className="h-11 rounded-xl border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-1 focus-visible:ring-white"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-zinc-300">
                  Password
                </Label>

                <Link
                  href="/forgot-password"
                  className="text-xs text-zinc-400 transition hover:text-white"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-11 rounded-xl border-zinc-700 bg-zinc-800 pr-11 text-white placeholder:text-zinc-500 focus-visible:ring-1 focus-visible:ring-white"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="group mt-2 h-11 w-full rounded-xl bg-white font-medium text-black hover:bg-zinc-200"
            >
              Sign in
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800" />
            </div>

            <div className="relative flex justify-center">
              <span className="bg-zinc-900 px-3 text-xs uppercase tracking-wider text-zinc-500">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="h-11 w-full rounded-xl border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white"
          >
            <svg
              className="mr-2 h-5 w-5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M21.35 11.1H12v2.9h5.4c-.23 1.47-1.76 4.3-5.4 4.3-3.25 0-5.9-2.69-5.9-6s2.65-6 5.9-6c1.85 0 3.1.79 3.82 1.47l2.6-2.5C16.8 3.78 14.64 3 12 3 7.03 3 3 7.03 3 12s4.03 9 9 9c5.19 0 8.62-3.65 8.62-8.8 0-.59-.06-.96-.13-1.1Z"
              />
            </svg>
            Continue with Google
          </Button>

          <p className="text-center text-sm text-zinc-400">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-white transition hover:text-zinc-300"
            >
              Create one
            </Link>
          </p>

          <p className="text-center text-xs leading-relaxed text-zinc-500">
            By signing in you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}