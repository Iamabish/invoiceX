"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";

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
        <Button
          key={filter}
          onClick={() => handleFilter(filter)}
          className={` text-sm rounded-2xl  px-5 py-3 cursor-pointer  font-medium text-white shadow-sm transition hover:bg-[#16385f] font-medium  ${
            currentStatus === filter
              ? "bg-[#0F2A4A] text-white"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          {filter}
        </Button>
      ))}
    </div>
  );
}

export default FilterToggle