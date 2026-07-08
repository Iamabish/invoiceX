"use client";

import { SlidersHorizontal } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const filters = ["All", "Sent", "Paid", "Overdue", "Draft"];

const FilterToggle = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get("status") || "All";

  const handleFilter = (filter: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (filter === "All") {
      params.delete("status");
    } else {
      params.set("status", filter);
    }

    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto border-b border-ix-border p-4 sm:p-6">
      <SlidersHorizontal className="h-4 w-4 flex-shrink-0 text-ix-muted" />
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => handleFilter(filter)}
          className={`whitespace-nowrap rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all ${
            currentStatus === filter
              ? "bg-ix-teal text-white"
              : "border border-ix-border bg-ix-surface text-ix-charcoal hover:bg-ix-elevated"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default FilterToggle;