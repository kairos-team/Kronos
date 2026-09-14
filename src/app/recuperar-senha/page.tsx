import { Card } from "@/components/ui/Card";
import { KronosLogo } from "@/components/layout/KronosLogo";
import { RecoveryForm } from "@/components/auth/RecoveryForm";

export default function RecoveryPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 dark:bg-stone-900 px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 mb-8">
          <KronosLogo className="h-10 w-10 text-orange-700 dark:text-orange-400" />
          <span className="text-xl font-bold tracking-wide text-stone-900 dark:text-stone-100">
            KRONOS
          </span>
        </div>
        <Card className="p-6">
          <RecoveryForm />
        </Card>
      </div>
    </div>
  );
}
