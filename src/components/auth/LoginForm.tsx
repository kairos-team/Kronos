"use client";

import { useActionState } from "react";
import { login, type AuthFormState } from "@/lib/auth-actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { labelClass, inputClass } from "@/components/ui/field-styles";

const initialState: AuthFormState = null;

export function LoginForm() {
  const [state, formAction] = useActionState(login, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <p className="text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded-lg px-3 py-2.5">
          {state.error}
        </p>
      )}
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
          autoComplete="current-password"
          className={inputClass}
        />
      </div>
      <SubmitButton className="w-full">Entrar</SubmitButton>
      <a
        href="/recuperar-senha"
        className="block text-center text-sm text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
      >
        Esqueci minha senha
      </a>
    </form>
  );
}
