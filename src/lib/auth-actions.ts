"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  verifyPassword,
  setSessionCookie,
  clearSessionCookie,
  requireAuth,
} from "@/lib/auth";

export type AuthFormState = { error: string } | null;
export type AccountFormState = { error?: string; success?: string } | null;

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

export async function updateAccount(
  _prevState: AccountFormState,
  formData: FormData
): Promise<AccountFormState> {
  const user = await requireAuth();

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!name) return { error: "Nome é obrigatório." };
  if (!email) return { error: "E-mail é obrigatório." };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing && existing.id !== user.id) {
    return { error: "Já existe uma conta com esse e-mail." };
  }

  await prisma.user.update({ where: { id: user.id }, data: { name, email } });
  revalidatePath("/", "layout");

  return { success: "Dados atualizados com sucesso." };
}

export async function changePassword(
  _prevState: AccountFormState,
  formData: FormData
): Promise<AccountFormState> {
  const user = await requireAuth();

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (newPassword.length < 8) return { error: "A nova senha precisa ter pelo menos 8 caracteres." };
  if (newPassword !== confirmPassword) return { error: "As senhas não coincidem." };

  const fullUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!fullUser || !(await verifyPassword(currentPassword, fullUser.passwordHash))) {
    return { error: "Senha atual incorreta." };
  }

  const passwordHash = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

  return { success: "Senha alterada com sucesso." };
}

export async function resetPasswordWithRecoveryKey(
  _prevState: AccountFormState,
  formData: FormData
): Promise<AccountFormState> {
  const recoveryKey = process.env.RECOVERY_SECRET;
  if (!recoveryKey) {
    return { error: "Recuperação de senha não está configurada neste ambiente." };
  }

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const providedKey = String(formData.get("recoveryKey") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!email) return { error: "Informe o e-mail da conta." };
  if (providedKey !== recoveryKey) return { error: "Chave de recuperação inválida." };
  if (newPassword.length < 8) return { error: "A nova senha precisa ter pelo menos 8 caracteres." };
  if (newPassword !== confirmPassword) return { error: "As senhas não coincidem." };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { error: "Nenhuma conta encontrada com esse e-mail." };

  const passwordHash = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

  return { success: "Senha redefinida com sucesso. Você já pode fazer login." };
}
