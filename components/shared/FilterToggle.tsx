"use client";

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
    <div className="flex flex-wrap gap-3 border-b border-zinc-200 p-6">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => handleFilter(filter)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            currentStatus === filter
              ? "bg-black text-white"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}

export default FilterToggle