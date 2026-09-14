import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import clsx from "clsx";

export function SummaryCard({
  label,
  value,
  icon: Icon,
  accent = "emerald",
  deltaPct,
  deltaLabel,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  accent?: "emerald" | "slate";
  deltaPct?: number | null;
  deltaLabel?: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-stone-500 dark:text-stone-400">{label}</span>
        <div
          className={clsx(
            "h-9 w-9 rounded-xl flex items-center justify-center",
            accent === "emerald"
              ? "bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400"
              : "bg-stone-100 dark:bg-stone-700 text-stone-500 dark:text-stone-400"
          )}
        >
          <Icon className="h-4.5 w-4.5" />
        </div>
      </div>
      <p className="mt-3 text-2xl font-semibold text-stone-900 dark:text-stone-100 tabular-nums">{value}</p>
      {deltaPct != null && (
        <p
          className={clsx(
            "mt-1.5 flex items-center gap-1 text-xs font-medium",
            deltaPct >= 0 ? "text-green-600 dark:text-green-400" : "text-stone-500 dark:text-stone-400"
          )}
        >
          {deltaPct >= 0 ? (
            <TrendingUp className="h-3.5 w-3.5" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" />
          )}
          {deltaPct >= 0 ? "+" : ""}
          {deltaPct}% {deltaLabel}
        </p>
      )}
    </Card>
  );
}
