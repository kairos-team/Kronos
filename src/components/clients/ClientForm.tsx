"use client";

import { SubmitButton } from "@/components/ui/SubmitButton";
import { labelClass, inputClass } from "@/components/ui/field-styles";

export function ClientForm({
  action,
  submitLabel,
  defaultValues,
}: {
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
  defaultValues?: {
    name?: string;
    email?: string | null;
    phone?: string | null;
    document?: string | null;
    notes?: string | null;
  };
}) {
  return (
    <form action={action} className="space-y-4">
      <div>
        <label className={labelClass} htmlFor="name">
          Nome *
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={defaultValues?.name}
          className={inputClass}
          placeholder="Nome do cliente"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass} htmlFor="email">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={defaultValues?.email ?? ""}
            className={inputClass}
            placeholder="cliente@email.com"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="phone">
            Telefone
          </label>
          <input
            id="phone"
            name="phone"
            defaultValue={defaultValues?.phone ?? ""}
            className={inputClass}
            placeholder="(00) 00000-0000"
          />
        </div>
      </div>
      <div>
        <label className={labelClass} htmlFor="document">
          CPF/CNPJ
        </label>
        <input
          id="document"
          name="document"
          defaultValue={defaultValues?.document ?? ""}
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass} htmlFor="notes">
          Observações
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          defaultValue={defaultValues?.notes ?? ""}
          className={inputClass}
        />
      </div>
      <div className="flex justify-end pt-2">
        <SubmitButton>{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}
