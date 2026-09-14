import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { KronosLogo } from "@/components/layout/KronosLogo";
import { LoginForm } from "@/components/auth/LoginForm";
import { SetupForm } from "@/components/auth/SetupForm";

export default async function LoginPage() {
  const currentUser = await getCurrentUser();
  if (currentUser) redirect("/");

  const userCount = await prisma.user.count();

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 dark:bg-stone-900 px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 mb-8">
          <KronosLogo className="h-10 w-10 text-orange-700 dark:text-orange-400" />
          <span className="text-xl font-bold tracking-wide text-stone-900 dark:text-stone-100">
            KRONOS
          </span>
        </div>
        <Card className="p-6">{userCount === 0 ? <SetupForm /> : <LoginForm />}</Card>
      </div>
    </div>
  );
}
