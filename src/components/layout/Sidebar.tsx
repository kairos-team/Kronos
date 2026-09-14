"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, LogOut } from "lucide-react";
import clsx from "clsx";
import { KronosLogo } from "@/components/layout/KronosLogo";
import { logout } from "@/lib/auth-actions";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clientes", label: "Clientes", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
      <div className="flex items-center justify-center gap-2.5 px-6 h-16 border-b border-stone-100 dark:border-stone-800">
        <KronosLogo className="h-7 w-7 shrink-0 stroke-orange-700 dark:stroke-orange-400" />
        <span className="text-lg font-bold tracking-wide text-stone-900 dark:text-stone-100">
          KRONOS
        </span>
      </div>
      <nav className="flex-1 px-3 py-6 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400"
                  : "text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100"
              )}
            >
              <Icon className="h-[18px] w-[18px]" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-3 border-t border-stone-100 dark:border-stone-800">
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium w-full text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Sair
          </button>
        </form>
      </div>
    </aside>
  );
}
