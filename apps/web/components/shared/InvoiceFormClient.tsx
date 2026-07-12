"use client";

import { useMemo, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  Plus,
  Trash2,
  CalendarDays,
  ChevronDown,
  FileText,
} from "lucide-react";
import { AvatarInitial } from "@/components/shared/AvatarInitial"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { createInvoice } from "@/app/actions/invoice";

export type LineItem = {
  description: string;
  quantity: number;
  unitPrice: number;
};

export type InvoiceFormValues = {
  clientId: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  taxRate: number;
  notes: string;
  items: LineItem[];
};

type Client = { id: string; name: string };

function formatCurrency(amount: number) {
  return `$${amount.toFixed(2)}`;
}

function toDate(value: string | undefined) {
  return value ? new Date(value) : new Date();
}

function toISODateString(date: Date) {
  return date.toISOString().split("T")[0];
}

export default function InvoiceFormClient({ clients }: { clients: Client[] }) {
    const [clientOpen, setClientOpen] = useState(false);
    const [issueDateOpen, setIssueDateOpen] = useState(false);
    const [dueDateOpen, setDueDateOpen] = useState(false);
  const {
    register,
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<InvoiceFormValues>({
    defaultValues: {
      clientId: "",
      invoiceNumber: "",
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: "",
      taxRate: 10,
      notes: "",
      items: [
        {
          description: "",
          quantity: 1,
          unitPrice: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items");
  const taxRate = watch("taxRate");
  const clientId = watch("clientId");

  const selectedClient = useMemo(
    () => clients?.find((c) => c.id === clientId),
    [clients, clientId]
  );

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => {
      return acc + Number(item.quantity || 0) * Number(item.unitPrice || 0);
    }, 0);
  }, [items]);

  const tax = subtotal * (Number(taxRate || 0) / 100);
  const total = subtotal + tax;

  async function onSubmit(data: InvoiceFormValues) {
    console.log(data);

    try {
      await createInvoice(data);
    } catch {
      // TODO: surface error state to the user
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <div className="card-surface p-6">
          <label className="ui-label mb-3 block">BILL TO</label>
          <Controller
            control={control}
            name="clientId"
            
            render={({ field }) => (
            <Popover open={clientOpen} onOpenChange={setClientOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="w-full flex items-center gap-3 p-3 bg-ix-elevated rounded-xl hover:bg-ix-elevated/80 transition-colors text-left"
                >
                  {selectedClient ? (
                    <>
                      <AvatarInitial name={selectedClient.name} size="md" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-ix-dark">
                          {selectedClient.name}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1">
                      <p className="text-sm text-ix-muted">Select a client</p>
                    </div>
                  )}

                  <ChevronDown className="w-4 h-4 text-ix-muted" />
                </button>
              </PopoverTrigger>

              <PopoverContent className="w-80 p-2" align="start">
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {clients?.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        field.onChange(c.id);
                        setClientOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-ix-elevated transition-colors text-left"
                    >
                      <AvatarInitial name={c.name} size="sm" />
                      <p className="text-sm font-medium text-ix-dark">{c.name}</p>
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            )}
          />
        </div>

        <div className="card-surface p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="ui-label mb-2 block">ISSUE DATE</label>
            <Controller
              control={control}
              name="issueDate"
              render={({ field }) => (
                <Popover open={issueDateOpen} onOpenChange={setIssueDateOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="w-full flex items-center gap-3 p-3 bg-ix-elevated rounded-xl hover:bg-ix-elevated/80 transition-colors text-left"
                    >
                      <CalendarDays className="w-4 h-4 text-ix-muted" />
                      <span className="text-sm text-ix-dark">
                        {toDate(field.value).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </button>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={toDate(field.value)}
                      onSelect={(d) => {
                        if (!d) return;
                        field.onChange(toISODateString(d));
                        setIssueDateOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>

          <div>
            <label className="ui-label mb-2 block">DUE DATE</label>
            <Controller
              control={control}
              name="dueDate"
              render={({ field }) => (
                <Popover open={dueDateOpen} onOpenChange={setDueDateOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 p-3 bg-ix-elevated rounded-xl hover:bg-ix-elevated/80 transition-colors text-left"
                  >
                    <CalendarDays className="w-4 h-4 text-ix-muted" />
                    <span className="text-sm text-ix-dark">
                      {field.value
                        ? toDate(field.value).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Select date"}
                    </span>
                  </button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? toDate(field.value) : undefined}
                    onSelect={(d) => {
                      if (!d) return;
                      field.onChange(toISODateString(d));
                      setDueDateOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
              )}
            />
          </div>
        </div>

        <div className="card-surface p-6">
          <label className="ui-label mb-4 block">LINE ITEMS</label>
          <div className="space-y-3">
            <div className="hidden sm:grid grid-cols-12 gap-3 text-xs text-ix-muted uppercase tracking-wider">
              <div className="col-span-5">Description</div>
              <div className="col-span-2">Qty</div>
              <div className="col-span-3">Unit Price</div>
              <div className="col-span-2 text-right">Amount</div>
            </div>

            {fields.map((field, index) => {
              const qty = Number(items?.[index]?.quantity) || 0;
              const price = Number(items?.[index]?.unitPrice) || 0;
              const amount = qty * price;

              return (
                <div
                  key={field.id}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start pb-3 border-b border-ix-border/50 last:border-0"
                >
                  <div className="sm:col-span-5">
                    <input
                      type="text"
                      placeholder="Item description"
                      {...register(`items.${index}.description`)}
                      className="w-full px-3 py-2 bg-ix-elevated rounded-lg text-sm text-ix-dark placeholder:text-ix-muted focus:outline-none focus:ring-2 focus:ring-ix-teal/20"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="number"
                      min={1}
                      {...register(`items.${index}.quantity`, {
                        valueAsNumber: true,
                      })}
                      className="w-full px-3 py-2 bg-ix-elevated rounded-lg text-sm text-ix-dark focus:outline-none focus:ring-2 focus:ring-ix-teal/20"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <input
                      type="number"
                      min={0}
                      {...register(`items.${index}.unitPrice`, {
                        valueAsNumber: true,
                      })}
                      className="w-full px-3 py-2 bg-ix-elevated rounded-lg text-sm text-ix-dark focus:outline-none focus:ring-2 focus:ring-ix-teal/20"
                    />
                  </div>
                  <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-2">
                    <span className="text-sm font-medium text-ix-dark">
                      {formatCurrency(amount)}
                    </span>
                    <button
                      type="button"
                      onClick={() => fields.length > 1 && remove(index)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-ix-muted hover:text-ix-status-overdue transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() =>
              append({
                description: "",
                quantity: 1,
                unitPrice: 0,
              })
            }
            className="mt-4 flex items-center gap-2 text-sm text-ix-teal hover:text-ix-teal-hover transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Line Item
          </button>
        </div>

        <div className="card-surface p-6">
          <label className="ui-label mb-2 block">NOTES & TERMS</label>
          <textarea
            {...register("notes")}
            placeholder="Payment terms, thank you note, or any additional information..."
            rows={3}
            className="w-full px-4 py-3 bg-ix-elevated rounded-xl text-sm text-ix-dark placeholder:text-ix-muted focus:outline-none focus:ring-2 focus:ring-ix-teal/20 resize-none"
          />
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="card-surface p-6 sticky top-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-ix-teal-pale rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-ix-teal" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-medium text-ix-dark">Invoice Summary</p>
              <p className="text-xs text-ix-muted">Auto-calculated</p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ix-charcoal">Subtotal</span>
              <span className="text-sm font-medium text-ix-dark">
                {formatCurrency(subtotal)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-ix-charcoal">Tax</span>
                <input
                  type="number"
                  {...register("taxRate", { valueAsNumber: true })}
                  className="w-14 px-2 py-1 bg-ix-elevated rounded text-xs text-center text-ix-dark focus:outline-none focus:ring-1 focus:ring-ix-teal/30"
                />
                <span className="text-xs text-ix-muted">%</span>
              </div>
              <span className="text-sm font-medium text-ix-dark">
                {formatCurrency(tax)}
              </span>
            </div>
            <div className="h-px bg-ix-border" />
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-ix-dark">Total</span>
              <span className="text-2xl font-semibold text-ix-teal">
                {formatCurrency(total)}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary text-sm py-3 disabled:opacity-60"
            >
              Send Invoice
            </button>
            <button type="button" className="w-full btn-secondary text-sm py-3">
              Save as Draft
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}