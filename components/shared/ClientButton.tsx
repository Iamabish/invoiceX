"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "../ui/button";
import ClientForm from "./ClientForm";

export default function ClientButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} 
      className="w-full btn-primary py-3 text-sm disabled:opacity-60 sm:w-auto"
      variant= "ghost"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Client
      </Button>

      <ClientForm
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}