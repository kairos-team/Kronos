"use client";

import { useActionState } from "react";
import { changePassword, type AccountFormState } from "@/lib/auth-actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { labelClass, inputClass } from "@/components/ui/field-styles";

const initialState: AccountFormState = null;

export function ChangePasswordForm() {
  const [state, formAction] = useActionState(changePassword, initialState);

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
        <label className={labelClass} htmlFor="currentPassword">
          Senha atual
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass} htmlFor="newPassword">
          Nova senha
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass} htmlFor="confirmPassword">
          Confirmar nova senha
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
        />
      </div>
      <div className="flex justify-end pt-2">
        <SubmitButton>Alterar senha</SubmitButton>
      </div>
    </form>
  );
}
