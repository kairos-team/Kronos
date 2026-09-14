"use client";

import { useActionState } from "react";
import { resetPasswordWithRecoveryKey, type AccountFormState } from "@/lib/auth-actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { labelClass, inputClass } from "@/components/ui/field-styles";

const initialState: AccountFormState = null;

export function RecoveryForm() {
  const [state, formAction] = useActionState(resetPasswordWithRecoveryKey, initialState);

  if (state?.success) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30 rounded-lg px-3 py-2.5">
          {state.success}
        </p>
        <a
          href="/login"
          className="inline-flex w-full items-center justify-center rounded-xl bg-orange-700 dark:bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-800 dark:hover:bg-orange-500 transition-colors"
        >
          Ir para o login
        </a>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <p className="text-sm text-stone-500 dark:text-stone-400">
        Redefina a senha de uma conta usando a chave de recuperação configurada no ambiente.
      </p>
      {state?.error && (
        <p className="text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded-lg px-3 py-2.5">
          {state.error}
        </p>
      )}
      <div>
        <label className={labelClass} htmlFor="email">
          E-mail da conta
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass} htmlFor="recoveryKey">
          Chave de recuperação
        </label>
        <input
          id="recoveryKey"
          name="recoveryKey"
          type="password"
          required
          autoComplete="off"
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
      <SubmitButton className="w-full">Redefinir senha</SubmitButton>
    </form>
  );
}
