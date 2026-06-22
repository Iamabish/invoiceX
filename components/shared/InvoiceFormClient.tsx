"use client";

import { useMemo } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
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

type Client = { id: string; name: string }

export default function InvoiceFormClient({ clients }: { clients: Client[] }) {
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

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => {
      return (
        acc +
        (Number(item.quantity || 0) *
          Number(item.unitPrice || 0))
      );
    }, 0);
  }, [items]);

  const tax = subtotal * (Number(taxRate || 0) / 100);
  const total = subtotal + tax;

  async function onSubmit(data: InvoiceFormValues) {
    console.log(data);

    try {
        await createInvoice(data)
    }catch {
        
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 p-8"
    >
      <div className="space-y-2 w-[400px]">
        <label className="text-sm font-medium">
            Client
        </label>

        <Select onValueChange={(val) => setValue("clientId", val)}>
            <SelectTrigger className="h-11 rounded-xl w-full">
            <SelectValue placeholder="Select a client" />
            </SelectTrigger>

            <SelectContent>
            {clients?.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                {c.name}
                </SelectItem>
            ))}
            </SelectContent>
        </Select>
        </div>

      <div className="grid gap-5 md:grid-cols-2">
        

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Issue Date
          </label>

          <Input
            type="date"
            {...register("issueDate")}
            className="h-11 rounded-xl"
            readOnly
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Due Date
          </label>

          <Input
            type="date"
            {...register("dueDate")}
            className="h-11 rounded-xl"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200">
        <div className="border-b border-zinc-200 px-6 py-4">
          <h3 className="font-semibold">
            Line Items
          </h3>
        </div>

        <div className="p-6">
          <div className="mb-4 hidden grid-cols-[1fr_100px_140px_140px_50px] gap-4 border-b border-zinc-200 pb-3 text-sm font-medium text-zinc-500 md:grid">
            <div>Description</div>
            <div>Qty</div>
            <div>Unit Price</div>
            <div>Amount</div>
            <div></div>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => {
              const qty =
                Number(items?.[index]?.quantity) || 0;

              const price =
                Number(items?.[index]?.unitPrice) || 0;

              const amount = qty * price;

              return (
                <div
                  key={field.id}
                  className="grid gap-4 md:grid-cols-[1fr_100px_140px_140px_50px]"
                >
                  <Input
                    placeholder="Logo Design"
                    {...register(
                      `items.${index}.description`
                    )}
                    className="rounded-xl"
                  />

                  <Input
                    type="number"
                    min={1}
                    {...register(
                      `items.${index}.quantity`,
                      {
                        valueAsNumber: true,
                      }
                    )}
                    className="rounded-xl"
                  />

                  <Input
                    type="number"
                    min={0}
                    {...register(
                      `items.${index}.unitPrice`,
                      {
                        valueAsNumber: true,
                      }
                    )}
                    className="rounded-xl"
                  />

                  <div className="flex h-11 items-center rounded-xl border bg-zinc-50 px-4 font-medium">
                    ${amount.toFixed(2)}
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      fields.length > 1 &&
                      remove(index)
                    }
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Add Item */}
          <div className="mt-6 flex justify-end">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() =>
                append({
                  description: "",
                  quantity: 1,
                  unitPrice: 0,
                })
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Line Item
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <div className="w-full max-w-sm rounded-2xl border border-zinc-200 p-6">
          <div className="flex justify-between py-2">
            <span className="text-zinc-500">
              Subtotal
            </span>

            <span className="font-medium">
              ${subtotal.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-zinc-500">
              Tax Rate
            </span>

            <div className="flex items-center gap-2">
              <Input
                type="number"
                {...register("taxRate", {
                  valueAsNumber: true,
                })}
                className="h-9 w-20 rounded-lg text-center"
              />
              %
            </div>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-zinc-500">
              Tax
            </span>

            <span className="font-medium">
              ${tax.toFixed(2)}
            </span>
          </div>

          <div className="mt-3 flex justify-between border-t pt-4 text-lg font-semibold">
            <span>Total</span>

            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Notes / Payment Terms
        </label>

        <Textarea
          rows={5}
          placeholder="Optional notes, payment instructions, bank details..."
          {...register("notes")}
          className="min-h-[140px] rounded-xl"
        />
      </div>

          <div className="flex justify-end gap-3 border-t border-zinc-200 pt-6">
        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
        >
          Save as Draft
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-black px-6 hover:bg-zinc-800"
        >
          Send Now
        </Button>
      </div>
    </form>
  );
}