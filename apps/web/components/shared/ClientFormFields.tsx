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
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('company', data.company ?? '');
    formData.append('phone', data.phone ?? '');
    formData.append('address', data.address ?? '');

    let result;

    if (isEditing) {
      result = await editClient(client.id, formData);
    } else {
      result = await addClient(formData);
    }

    if (result.success) {
      toast.success(result.message);

      reset();
      onClose();
    } else {
      toast.error(result.error);
    }
  };

 return (
  <form
    onSubmit={handleSubmit(onSubmit)}
    className="space-y-6"
  >
    <div className="card-surface p-6 space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="ui-label block">
            Name <span className="text-red-500">*</span>
          </label>

          <Input
            placeholder="John Doe"
            className="h-11 rounded-xl border-0 bg-ix-elevated text-ix-dark placeholder:text-ix-muted focus-visible:ring-2 focus-visible:ring-ix-teal/20"
            {...register('name')}
          />

          {errors.name && (
            <p className="text-sm text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="ui-label block">
            Email <span className="text-red-500">*</span>
          </label>

          <Input
            type="email"
            placeholder="john@example.com"
            className="h-11 rounded-xl border-0 bg-ix-elevated text-ix-dark placeholder:text-ix-muted focus-visible:ring-2 focus-visible:ring-ix-teal/20"
            {...register('email')}
          />

          {errors.email && (
            <p className="text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="ui-label block">Company</label>

          <Input
            placeholder="Acme Inc."
            className="h-11 rounded-xl border-0 bg-ix-elevated text-ix-dark placeholder:text-ix-muted focus-visible:ring-2 focus-visible:ring-ix-teal/20"
            {...register('company')}
          />

          {errors.company && (
            <p className="text-sm text-red-500">
              {errors.company.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="ui-label block">Phone</label>

          <Input
            placeholder="+91 98765 43210"
            className="h-11 rounded-xl border-0 bg-ix-elevated text-ix-dark placeholder:text-ix-muted focus-visible:ring-2 focus-visible:ring-ix-teal/20"
            {...register('phone')}
          />

          {errors.phone && (
            <p className="text-sm text-red-500">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="ui-label block">Address</label>

          <Textarea
            placeholder="221B Baker Street, London"
            rows={4}
            className="min-h-[120px] resize-none rounded-xl border-0 bg-ix-elevated text-ix-dark placeholder:text-ix-muted focus-visible:ring-2 focus-visible:ring-ix-teal/20"
            {...register('address')}
          />

          {errors.address && (
            <p className="text-sm text-red-500">
              {errors.address.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-ix-border pt-6">
        <Button
          type="button"
          variant="outline"
          className="rounded-xl border-ix-border bg-transparent text-ix-charcoal hover:bg-ix-elevated"
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant={"ghost"}
          disabled={isSubmitting}
          className="btn-primary rounded-xl px-6 disabled:opacity-60"
        >
          {isSubmitting
            ? isEditing
              ? 'Updating...'
              : 'Saving...'
            : isEditing
            ? 'Update Client'
            : 'Save Client'}
        </Button>
      </div>
    </div>
  </form>
);
}