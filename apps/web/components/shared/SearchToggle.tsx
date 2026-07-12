"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import clsx from "clsx";
import Search from "./Search";

const SearchToggle = () => {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const openSearch = () => {
    setOpen(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
  };

  return (
    <div
      className={clsx(
        "flex items-center overflow-hidden rounded-xl border border-ix-border bg-white transition-all duration-300 ease-in-out",
       open ? "w-full sm:w-80 shadow-sm" : "w-11"
      )}
    >
      {!open ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={openSearch}
          className="h-11 w-11 rounded-xl text-ix-charcoal hover:bg-ix-teal-pale hover:text-ix-teal"
        >
          <SearchIcon className="h-4 w-4" strokeWidth={1.5} />
        </Button>
      ) : (
        <Search />
      )}
    </div>
  );
};

export default SearchToggle;