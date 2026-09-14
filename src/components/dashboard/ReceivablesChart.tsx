import { formatCurrency, formatMonthShort, formatMonthLabel } from "@/lib/format";

const CHART_HEIGHT = 120;

export function ReceivablesChart({
  data,
}: {
  data: { month: Date; previsto: number; recebido: number }[];
}) {
  const max = Math.max(1, ...data.flatMap((d) => [d.previsto, d.recebido]));

  return (
    <div>
      <div className="flex items-center gap-4 text-xs text-stone-500 dark:text-stone-400">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-[2px] bg-stone-300 dark:bg-stone-600" />
          Previsto
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-[2px] bg-green-600 dark:bg-green-500" />
          Recebido
        </span>
      </div>

      <div
        className="flex items-end justify-between gap-1.5 sm:gap-3 mt-5"
        style={{ height: CHART_HEIGHT + 24 }}
      >
        {data.map((d) => {
          const previstoHeight = Math.max(2, Math.round((d.previsto / max) * CHART_HEIGHT));
          const recebidoHeight = Math.max(2, Math.round((d.recebido / max) * CHART_HEIGHT));
          return (
            <div key={d.month.toISOString()} className="flex-1 flex flex-col items-center gap-2">
              <div className="flex items-end gap-[3px]" style={{ height: CHART_HEIGHT }}>
                <div
                  title={`Previsto em ${formatMonthLabel(d.month)}: ${formatCurrency(d.previsto)}`}
                  className="w-2.5 sm:w-3.5 rounded-t-[4px] bg-stone-200 dark:bg-stone-700"
                  style={{ height: previstoHeight }}
                />
                <div
                  title={`Recebido em ${formatMonthLabel(d.month)}: ${formatCurrency(d.recebido)}`}
                  className="w-2.5 sm:w-3.5 rounded-t-[4px] bg-green-600 dark:bg-green-500"
                  style={{ height: recebidoHeight }}
                />
              </div>
              <span className="text-[11px] text-stone-500 dark:text-stone-400">
                {formatMonthShort(d.month)}
              </span>
            </div>
          );
        })}
      </div>

      <details className="mt-4">
        <summary className="text-xs font-medium text-stone-500 dark:text-stone-400 cursor-pointer hover:text-stone-700 dark:hover:text-stone-200">
          Ver valores em tabela
        </summary>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-stone-500 dark:text-stone-400 border-b border-stone-100 dark:border-stone-700">
                <th className="py-1.5 font-medium">Mês</th>
                <th className="py-1.5 font-medium text-right">Previsto</th>
                <th className="py-1.5 font-medium text-right">Recebido</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr
                  key={d.month.toISOString()}
                  className="border-b border-stone-100 dark:border-stone-800 last:border-0"
                >
                  <td className="py-1.5 text-stone-700 dark:text-stone-300">
                    {formatMonthLabel(d.month)}
                  </td>
                  <td className="py-1.5 text-right tabular-nums text-stone-700 dark:text-stone-300">
                    {formatCurrency(d.previsto)}
                  </td>
                  <td className="py-1.5 text-right tabular-nums text-green-700 dark:text-green-400 font-medium">
                    {formatCurrency(d.recebido)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
