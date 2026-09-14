export function ServiceProgressBar({ paid, total }: { paid: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((paid / total) * 100);

  return (
    <div>
      <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1.5">
        <span>
          {paid}/{total} parcela{total === 1 ? "" : "s"} paga{total === 1 ? "" : "s"}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-stone-100 dark:bg-stone-700 overflow-hidden">
        <div
          className="h-full rounded-full bg-green-600 dark:bg-green-500 transition-[width]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
