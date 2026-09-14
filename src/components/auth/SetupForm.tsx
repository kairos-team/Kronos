"use client";

import { useActionState } from "react";
import { createFirstAdmin, type AuthFormState } from "@/lib/auth-actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { labelClass, inputClass } from "@/components/ui/field-styles";

const initialState: AuthFormState = null;

export function SetupForm() {
  const [state, formAction] = useActionState(createFirstAdmin, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <p className="text-sm text-stone-500 dark:text-stone-400">
        Primeiro acesso — crie a conta de administrador do sistema.
      </p>
      {state?.error && (
        <p className="text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded-lg px-3 py-2.5">
          {state.error}
        </p>
      )}
      <div>
        <label className={labelClass} htmlFor="name">
          Nome
        </label>
        <input
          id="name"
          name="name"
          required
          autoComplete="name"
          className={inputClass}
        />
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
          autoComplete="email"
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass} htmlFor="password">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
        />
        <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">Mínimo de 8 caracteres.</p>
      </div>
      <SubmitButton className="w-full">Criar conta e entrar</SubmitButton>
    </form>
  );
}
