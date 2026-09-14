import { LogOut, Download } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { KronosLogo } from "@/components/layout/KronosLogo";
import { logout } from "@/lib/auth-actions";

export function MobileHeader() {
  return (
    <header className="md:hidden sticky top-0 z-20 flex items-center justify-between gap-2 h-14 px-4 border-b border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 backdrop-blur">
      <div className="flex items-center gap-2">
        <KronosLogo className="h-6 w-6 shrink-0 text-orange-700 dark:text-orange-400" />
        <span className="font-bold tracking-wide text-stone-900 dark:text-stone-100">KRONOS</span>
      </div>
      <div className="flex items-center gap-1">
        <a
          href="/api/export"
          aria-label="Exportar dados"
          className="flex items-center justify-center h-8 w-8 rounded-lg text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
        >
          <Download className="h-4 w-4" />
        </a>
        <ThemeToggle compact />
        <form action={logout}>
          <button
            type="submit"
            aria-label="Sair"
            className="flex items-center justify-center h-8 w-8 rounded-lg text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </form>
      </div>
    </header>
  );
}
