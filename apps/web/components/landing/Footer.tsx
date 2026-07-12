import Link from "next/link";
import { Bolt } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
                <Bolt className="h-5 w-5" />
              </div>

              <span className="text-xl font-semibold tracking-tight">
                InvoiceX
              </span>
            </div>

            <p className="max-w-sm text-[15px] leading-7 text-zinc-600">
              Professional invoicing for freelancers, developers, and small
              agencies.
            </p>
          </div>

          <div>
            <h5 className="mb-5 text-sm font-semibold uppercase tracking-wide text-zinc-900">
              Product
            </h5>

            <div className="flex flex-col gap-3">
              <Link
                href="#features"
                className="text-zinc-600 transition hover:text-black"
              >
                Features
              </Link>

              <Link
                href="#pricing"
                className="text-zinc-600 transition hover:text-black"
              >
                Pricing
              </Link>

              <Link
                href="#"
                className="text-zinc-600 transition hover:text-black"
              >
                Changelog
              </Link>

              <Link
                href="#"
                className="text-zinc-600 transition hover:text-black"
              >
                Roadmap
              </Link>
            </div>
          </div>

          <div>
            <h5 className="mb-5 text-sm font-semibold uppercase tracking-wide text-zinc-900">
              Resources
            </h5>

            <div className="flex flex-col gap-3">
              <Link
                href="#"
                className="text-zinc-600 transition hover:text-black"
              >
                Documentation
              </Link>

              <Link
                href="#"
                className="text-zinc-600 transition hover:text-black"
              >
                API Reference
              </Link>

              <Link
                href="#"
                className="text-zinc-600 transition hover:text-black"
              >
                Blog
              </Link>

              <Link
                href="#"
                className="text-zinc-600 transition hover:text-black"
              >
                Support
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h5 className="mb-5 text-sm font-semibold uppercase tracking-wide text-zinc-900">
              Company
            </h5>

            <div className="flex flex-col gap-3">
              <Link
                href="#"
                className="text-zinc-600 transition hover:text-black"
              >
                Privacy Policy
              </Link>

              <Link
                href="#"
                className="text-zinc-600 transition hover:text-black"
              >
                Terms of Service
              </Link>

              <Link
                href="#"
                className="text-zinc-600 transition hover:text-black"
              >
                Security
              </Link>

              <Link
                href="#"
                className="text-zinc-600 transition hover:text-black"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-zinc-200 pt-8 md:flex-row">
          <div className="flex items-center gap-3 text-sm text-zinc-500">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

            <span>© 2026 InvoiceX. All systems normal.</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="#"
              aria-label="Twitter"
              className="rounded-xl border border-zinc-200 p-2.5 text-zinc-600 transition hover:border-black "
            >
             <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 30 30">
                <path d="M 6 4 C 4.895 4 4 4.895 4 6 L 4 24 C 4 25.105 4.895 26 6 26 L 24 26 C 25.105 26 26 25.105 26 24 L 26 6 C 26 4.895 25.105 4 24 4 L 6 4 z M 8.6484375 9 L 13.259766 9 L 15.951172 12.847656 L 19.28125 9 L 20.732422 9 L 16.603516 13.78125 L 21.654297 21 L 17.042969 21 L 14.056641 16.730469 L 10.369141 21 L 8.8945312 21 L 13.400391 15.794922 L 8.6484375 9 z M 10.878906 10.183594 L 17.632812 19.810547 L 19.421875 19.810547 L 12.666016 10.183594 L 10.878906 10.183594 z"></path>
            </svg>
            </Link>

            <Link
              href="#"
              aria-label="GitHub"
              className="rounded-xl border border-zinc-200 p-2.5 text-zinc-600 transition hover:border-black "
            >
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 30 30">
                <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
            </svg>
            </Link>

          </div>
        </div>
      </div>
    </footer>
  );
}