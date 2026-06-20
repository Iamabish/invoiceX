"use client";

import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import useDebounce from "@/app/hooks/useDebounce";
import { useEffect, useState } from "react";

const Search = () => {

    const router = useRouter()
    const searchParams = useSearchParams()
    const pathName = usePathname()
    const [search, setSearch] = useState(searchParams.get('search') ?? "")


    console.log('search value', search);
    

    const debounceSearch = useDebounce(search, 500)

    useEffect(() => {

        console.log('debounce value', debounceSearch);
        

        const params = new URLSearchParams(searchParams);

        if (debounceSearch) {
            params.set("search", debounceSearch);
        } else {
            params.delete("search");
        }


        console.log('params after update', params);
        
        router.replace(`${pathName}?${params.toString()}`);
    }, [debounceSearch, pathName, router]);

  return (
    <div className="relative w-full max-w-md " >
      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        type="text"
        value={search}
        placeholder="Search clients..."
        onChange={(e) => setSearch(e.target.value)}
        className="h-11   rounded-xl border-border bg-background pl-10 pr-14 shadow-sm transition-all duration-200 placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/15"
      />

      <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-md border bg-muted px-2 py-0.5text-[11px] font-medium text-muted-foreground">
        ⌘K
      </div>
    </div>
  );
};

export default Search;