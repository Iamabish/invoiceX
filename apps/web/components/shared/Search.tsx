"use client";

import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import useDebounce from "@/app/hooks/useDebounce";
import { useEffect, useState } from "react";

const Search = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  const debounceSearch = useDebounce(search, 500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (debounceSearch) {
      params.set("search", debounceSearch);
    } else {
      params.delete("search");
    }

    router.replace(`${pathName}?${params.toString()}`);
  }, [debounceSearch, pathName, router]);

  return (
    <div className="relative w-full max-w-md">
      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ix-charcoal" strokeWidth={1.5} />

      <Input
        type="text"
        value={search}
        placeholder="Search clients..."
        onChange={(e) => setSearch(e.target.value)}
        className="h-11 rounded-xl border-ix-border bg-white pl-10 pr-14 text-sm text-ix-dark shadow-sm transition-all duration-200 placeholder:text-ix-charcoal/60 focus-visible:border-ix-teal focus-visible:ring-2 focus-visible:ring-ix-teal/15"
      />

      
    </div>
  );
};

export default Search;