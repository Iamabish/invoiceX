"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import Search  from "./Search";

const SearchToggle = () => {

    console.log('in the search toggle');
    

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
        "flex items-center overflow-hidden rounded-xl border bg-background transition-all duration-300 ease-in-out",
        open ? "w-80 shadow-sm" : "w-11"
      )}
    >
      {!open ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={openSearch}
          className="h-11 w-11 rounded-xl"
        >
          <Search  />
        </Button>
      ) : (
        <>
          <Search />
        </>
      )}
    </div>
  );
};

export default SearchToggle;