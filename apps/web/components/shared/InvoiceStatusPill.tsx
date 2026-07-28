"use client";

import { useEffect, useState } from "react";
import { getInvoiceStatus } from "@/app/actions/invoice";

const statusConfig: Record<string, { label: string; dot: string; text: string; bg: string }> = {
  PAID: { label: "Paid", dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
  SENT: { label: "Sent", dot: "bg-sky-500", text: "text-sky-700", bg: "bg-sky-50" },
  QUEUED: { label: "Queued", dot: "bg-violet-500", text: "text-violet-700", bg: "bg-violet-50" },
  OVERDUE: { label: "Overdue", dot: "bg-red-500", text: "text-red-700", bg: "bg-red-50" },
  DRAFT: { label: "Draft", dot: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50" },
};

export default function InvoiceStatusPill({
  invoiceId,
  initialStatus,
}: {
  invoiceId: string;
  initialStatus: string;
}) {
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    if (status !== "QUEUED") return;

   const interval = setInterval(async () => {
      const result = await getInvoiceStatus(invoiceId);
      if (result.success && result.data && result.data !== status) {
        setStatus(result.data);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [status, invoiceId]);

  const config = statusConfig[status] ?? statusConfig.DRAFT;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium ${config.bg} ${config.text}`}
    >
      <span className={`h-2 w-2 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}