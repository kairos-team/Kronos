import { Download } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Avatar } from "@/components/ui/Avatar";

export function Header({ user }: { user: { name: string; email: string } }) {
  return (
    <header className="hidden md:flex md:ml-64 sticky top-0 z-20 items-center justify-end gap-2 h-16 pr-8 border-b border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 backdrop-blur">
      <a
        href="/api/export"
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
      >
        <Download className="h-4 w-4" />
        Exportar dados
      </a>
      <ThemeToggle compact />
      <div className="flex items-center gap-2.5 pl-3 ml-1 border-l border-stone-200 dark:border-stone-700">
        <Avatar name={user.name} size="sm" />
        <div className="hidden lg:block leading-tight">
          <p className="text-sm font-medium text-stone-900 dark:text-stone-100">{user.name}</p>
          <p className="text-xs text-stone-400 dark:text-stone-500">{user.email}</p>
        </div>
      </div>
    </header>
  );
}
