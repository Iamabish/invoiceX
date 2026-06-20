import Link from "next/link";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[#FCFBF8] pt-44 pb-28">
      <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-neutral-300/20 blur-[120px]" />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 text-center">
        <div className="mb-8 rounded-full border border-neutral-200 bg-white/70 px-5 py-2 text-sm font-medium text-neutral-600 shadow-sm backdrop-blur-md">
          Built for independent professionals
        </div>

        <h1 className="max-w-4xl font-sans text-5xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-6xl lg:text-7xl">
          You should spend time
          <br />
          on the{" "}
          <span className="bg-gradient-to-r font-serif italic from-neutral-900 via-neutral-700 to-neutral-500 bg-clip-text text-transparent">
            work, not the paperwork.
          </span>
        </h1>

        <p className="mt-8 font-sans max-w-2xl text-lg leading-8 text-neutral-600 sm:text-xl">
          Create professional invoices, manage clients, accept payments,
          and track your revenue — all from one beautifully simple dashboard.
        </p>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/sign-up"
            className="rounded-md bg-neutral-900 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-black hover:shadow-xl"
          >
            Start for free
          </Link>

          <Link
            href="#features"
            className="group flex items-center justify-center gap-2 rounded-md border border-neutral-300 bg-white/70 px-8 py-4 text-base font-semibold text-neutral-900 backdrop-blur transition-all duration-300 hover:border-neutral-900 hover:bg-white"
          >
            See how it works

            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <p className="mt-8 text-sm text-neutral-500">
          Free plan forever · No credit card required
        </p>
      </div>
    </section>
  );
};

export default Hero;