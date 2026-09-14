import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { formatCurrency, formatRelativeTime } from "@/lib/format";

type Activity = {
  id: string;
  number: number;
  value: number;
  paidAt: Date | null;
  service: { description: string; installmentsCount: number; clientId: string; client: { name: string } };
};

export function RecentActivity({ activity }: { activity: Activity[] }) {
  if (activity.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
        <CheckCircle2 className="h-6 w-6 text-stone-300 dark:text-stone-600" />
        <p className="text-sm text-stone-500 dark:text-stone-400">Nenhum pagamento registrado ainda.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-stone-100 dark:divide-stone-700">
      {activity.map((item) => (
        <li key={item.id}>
          <Link
            href={`/clientes/${item.service.clientId}`}
            className="flex items-center gap-3 py-3 hover:bg-stone-50 dark:hover:bg-stone-700/50 -mx-1 px-1 rounded-lg transition-colors"
          >
            <Avatar name={item.service.client.name} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-stone-900 dark:text-stone-100 truncate">
                <span className="font-medium">{item.service.client.name}</span> pagou a parcela{" "}
                {item.number}/{item.service.installmentsCount}
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400 truncate mt-0.5">
                {item.service.description}
                {item.paidAt && <> · {formatRelativeTime(item.paidAt)}</>}
              </p>
            </div>
            <span className="shrink-0 text-sm font-semibold text-green-700 dark:text-green-400 tabular-nums">
              {formatCurrency(item.value)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
