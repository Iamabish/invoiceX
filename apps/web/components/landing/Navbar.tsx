import Link from "next/link";
import { Bolt } from "lucide-react";

const Navbar = () => {
  return (
    <header className="fixed inset-x-0 top-6 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-neutral-200/70 bg-white/70 px-6 py-4 shadow-lg shadow-neutral-900/5 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white">
            <Bolt className="h-5 w-5" />
          </div>

          <span className="font-serif text-2xl font-semibold tracking-tight text-neutral-900">
            InvoiceX
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="#features"
            className="text-sm font-medium text-neutral-600 transition hover:text-neutral-900"
          >
            Features
          </Link>

          <Link
            href="#pricing"
            className="text-sm font-medium text-neutral-600 transition hover:text-neutral-900"
          >
            Pricing
          </Link>

          <Link
            href="#testimonials"
            className="text-sm font-medium text-neutral-600 transition hover:text-neutral-900"
          >
            Testimonials
          </Link>

          <Link
            href="#faq"
            className="text-sm font-medium text-neutral-600 transition hover:text-neutral-900"
          >
            FAQ
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/signin"
            className="rounded-md px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
          >
            Log in
          </Link>

          <Link
            href="/signup"
            className="rounded-md bg-neutral-900 px-5 py-2 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-black"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;