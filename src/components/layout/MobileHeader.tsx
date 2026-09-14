import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { KronosLogo } from "@/components/layout/KronosLogo";

export function MobileHeader() {
  return (
    <header className="md:hidden sticky top-0 z-20 flex items-center justify-between gap-2 h-14 px-4 border-b border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 backdrop-blur">
      <div className="flex items-center gap-2">
        <KronosLogo className="h-6 w-6 shrink-0 stroke-orange-700 dark:stroke-orange-400" />
        <span className="font-bold tracking-wide text-stone-900 dark:text-stone-100">KRONOS</span>
      </div>
      <ThemeToggle compact />
    </header>
  );
}
