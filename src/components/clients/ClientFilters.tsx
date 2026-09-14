"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";

const FILTERS = [
  { value: "all", label: "Todos" },
  { value: "ok", label: "Em dia" },
  { value: "overdue", label: "Com atraso" },
] as const;

const SORTS = [
  { value: "name", label: "Nome" },
  { value: "value", label: "Valor a receber" },
  { value: "due", label: "Próximo vencimento" },
] as const;

export function ClientFilters({
  counts,
}: {
  counts: { all: number; ok: number; overdue: number };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeFilter = searchParams.get("filter") ?? "all";
  const activeSort = searchParams.get("sort") ?? "name";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || value === "name") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => updateParam("filter", f.value)}
            className={clsx(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              activeFilter === f.value
                ? "bg-orange-700 dark:bg-orange-600 text-white"
                : "bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700"
            )}
          >
            {f.label} <span className="tabular-nums opacity-70">({counts[f.value]})</span>
          </button>
        ))}
      </div>

      <select
        value={activeSort}
        onChange={(event) => updateParam("sort", event.target.value)}
        className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-1.5 text-sm text-stone-600 dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500"
      >
        {SORTS.map((s) => (
          <option key={s.value} value={s.value}>
            Ordenar por {s.label}
          </option>
        ))}
      </select>
    </div>
  );
}
