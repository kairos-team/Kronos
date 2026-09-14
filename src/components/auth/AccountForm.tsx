"use client";

import { useActionState } from "react";
import { updateAccount, type AccountFormState } from "@/lib/auth-actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { labelClass, inputClass } from "@/components/ui/field-styles";

const initialState: AccountFormState = null;

export function AccountForm({ name, email }: { name: string; email: string }) {
  const [state, formAction] = useActionState(updateAccount, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <p className="text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded-lg px-3 py-2.5">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30 rounded-lg px-3 py-2.5">
          {state.success}
        </p>
      )}
      <div>
        <label className={labelClass} htmlFor="name">
          Nome
        </label>
        <input id="name" name="name" required defaultValue={name} className={inputClass} />
      </div>
      <div>
        <label className={labelClass} htmlFor="email">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          defaultValue={email}
          className={inputClass}
        />
      </div>
      <div className="flex justify-end pt-2">
        <SubmitButton>Salvar alterações</SubmitButton>
      </div>
    </form>
  );
}
