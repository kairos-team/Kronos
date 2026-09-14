import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { AccountForm } from "@/components/auth/AccountForm";
import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";

export default async function AccountPage() {
  const user = await requireAuth();

  return (
    <div className="space-y-6 max-w-lg">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
      >
        <ArrowLeft className="h-4 w-4" />
        Dashboard
      </Link>

      <div>
        <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
          Minha conta
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          Atualize seus dados e sua senha.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">Dados</h2>
        <Card className="p-5">
          <AccountForm name={user.name} email={user.email} />
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">Senha</h2>
        <Card className="p-5">
          <ChangePasswordForm />
        </Card>
      </div>
    </div>
  );
}
