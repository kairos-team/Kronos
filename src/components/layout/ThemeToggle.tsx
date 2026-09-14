"use client";

import { useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";
import clsx from "clsx";
import { subscribeTheme, getThemeSnapshot, getThemeServerSnapshot, setDarkMode } from "@/lib/theme-store";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const isDark = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getThemeServerSnapshot);

  function toggle() {
    setDarkMode(!isDark);
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
        className="flex items-center justify-center h-8 w-8 rounded-lg text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={clsx(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium w-full transition-colors",
        "text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100"
      )}
    >
      {isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
      {isDark ? "Tema claro" : "Tema escuro"}
    </button>
  );
}
