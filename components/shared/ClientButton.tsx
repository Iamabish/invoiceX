"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "../ui/button";
import ClientForm from "./ClientForm";

export default function ClientButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
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