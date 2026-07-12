"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ClientType } from "./ClientAction";
import { addClient } from "@/app/actions/client";
import { useEffect } from "react";
import { editClient } from "@/app/actions/client";
import { toast } from "sonner";
const formSchema = z.object({
  name: z.string().min(2, "Client name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ClientFormFieldsProps {
  onClose: () => void;
  client ?: ClientType
}

export default function ClientFormFields({onClose, client} : ClientFormFieldsProps) {
 const {
  register,
  handleSubmit,
  reset,
formState: { errors, isSubmitting },
} = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    name: client?.name ?? "",
    email: client?.email ?? "",
    company: client?.company ?? "",
    phone: client?.phone ?? "",
    address: client?.address ?? "",
  },
});


    useEffect(() => {
    if (client) {
        reset({
        name: client.name ?? "",
        email: client.email ?? "",
        company: client.company ?? "",
        phone: client.phone ?? "",
        address: client.address ?? "",
        });
    }
    }, [client, reset]);


    const isEditing = !!client;



  const onSubmit = async (data: FormValues) => {


    try {
      const formData = new FormData();

        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("company", data.company ?? "");
        formData.append("phone", data.phone ?? "");
        formData.append("address", data.address ?? "");

        if (isEditing) {
            await editClient(client.id, formData);

            toast.success("Client updated successfully");
            reset();
            onClose();

            } else {
            await addClient(formData);

            toast.success("Client created successfully");
            reset();
            onClose();
            }

    } catch (error) {
      console.error("Failed to create client:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-8"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-900">
            Name <span className="text-red-500">*</span>
          </label>

          <Input
            placeholder="John Doe"
            className="h-11 rounded-xl"
            {...register("name")}
          />

          {errors.name && (
            <p className="text-sm text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-900">
            Email <span className="text-red-500">*</span>
          </label>

          <Input
            type="email"
            placeholder="john@example.com"
            className="h-11 rounded-xl"
            {...register("email")}
          />

          {errors.email && (
            <p className="text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-900">
            Company
          </label>

          <Input
            placeholder="Acme Inc."
            className="h-11 rounded-xl"
            {...register("company")}
          />

          {errors.company && (
            <p className="text-sm text-red-500">
              {errors.company.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-900">
            Phone
          </label>

          <Input
            placeholder="+1 (555) 123-4567"
            className="h-11 rounded-xl"
            {...register("phone")}
          />

          {errors.phone && (
            <p className="text-sm text-red-500">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-zinc-900">
            Address
          </label>

          <Textarea
            placeholder="221B Baker Street, London"
            rows={5}
            className="min-h-[120px] resize-none rounded-xl"
            {...register("address")}
          />

          {errors.address && (
            <p className="text-sm text-red-500">
              {errors.address.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-zinc-200 pt-6">
        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-black px-6 hover:bg-zinc-800 disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : isEditing
            ? "Update Client"
            : "Save Client"}
        </Button>
      </div>
    </form>
  );
}