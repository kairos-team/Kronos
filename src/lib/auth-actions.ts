"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword, setSessionCookie, clearSessionCookie } from "@/lib/auth";

export type AuthFormState = { error: string } | null;

export async function createFirstAdmin(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const existingCount = await prisma.user.count();
  if (existingCount > 0) {
    return { error: "Já existe uma conta cadastrada. Faça login normalmente." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!name) return { error: "Nome é obrigatório." };
  if (!email) return { error: "E-mail é obrigatório." };
  if (password.length < 8) return { error: "A senha precisa ter pelo menos 8 caracteres." };

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, passwordHash },
  });

  await setSessionCookie(user.id);
  redirect("/");
}

export async function login(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Informe e-mail e senha." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "E-mail ou senha inválidos." };
  }

  await setSessionCookie(user.id);
  redirect("/");
}

export async function logout() {
  await clearSessionCookie();
  redirect("/login");
}
