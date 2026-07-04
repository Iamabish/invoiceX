"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "../ui/button";
import ClientForm from "./ClientForm";

export default function ClientButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-2xl bg-[#0F2A4A] px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#16385f]">
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