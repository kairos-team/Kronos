"use client";

import { useTransition } from "react";
import clsx from "clsx";
import { Check, AlertCircle } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import { getInstallmentStatus } from "@/lib/installments";
import { toggleInstallmentPaid } from "@/lib/actions";
import { useToast } from "@/components/ui/Toast";

export function InstallmentTimelineItem({
  installment,
  installmentsCount,
  clientId,
  subClientId,
  isLast,
}: {
  installment: { id: string; number: number; dueDate: Date; value: number; paid: boolean };
  installmentsCount: number;
  clientId: string;
  subClientId?: string;
  isLast: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const status = getInstallmentStatus(installment);
  const isOverdue = status === "ATRASADO";

  function handleToggle() {
    const nextPaid = !installment.paid;
    startTransition(async () => {
      await toggleInstallmentPaid(installment.id, nextPaid, clientId, subClientId);
      toast(nextPaid ? "Parcela marcada como paga." : "Parcela marcada como pendente.");
    });
  }

  return (
    <div className={clsx("relative flex gap-4", isPending && "opacity-60")}>
      {!isLast && (
        <span
          className={clsx(
            "absolute left-[15px] top-8 bottom-[-4px] w-px",
            installment.paid ? "bg-green-300 dark:bg-green-800" : "bg-stone-200 dark:bg-stone-700"
          )}
        />
      )}

      <button
        type="button"
        onClick={handleToggle}
        disabled={isPending}
        aria-label={installment.paid ? "Marcar parcela como pendente" : "Marcar parcela como paga"}
        className={clsx(
          "relative z-10 h-8 w-8 shrink-0 rounded-full flex items-center justify-center border-2 transition-colors",
          installment.paid
            ? "bg-green-600 border-green-600 text-white"
            : isOverdue
              ? "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:border-red-400 dark:hover:border-red-600"
              : "bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-600 text-stone-400 dark:text-stone-500 hover:border-green-400 dark:hover:border-green-500"
        )}
      >
        {installment.paid ? (
          <Check className="h-4 w-4" />
        ) : isOverdue ? (
          <AlertCircle className="h-4 w-4" />
        ) : (
          <span className="text-xs font-semibold">{installment.number}</span>
        )}
      </button>

      <div className="flex-1 flex items-center justify-between gap-3 pb-6">
        <div>
          <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
            Parcela {installment.number}/{installmentsCount}
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Vencimento {formatDate(installment.dueDate)}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 tabular-nums">
            {formatCurrency(installment.value)}
          </p>
          <p
            className={clsx(
              "text-xs font-medium mt-0.5",
              installment.paid
                ? "text-green-600 dark:text-green-400"
                : isOverdue
                  ? "text-red-600 dark:text-red-400"
                  : "text-stone-400 dark:text-stone-500"
            )}
          >
            {installment.paid ? "Pago" : isOverdue ? "Atrasado" : "Pendente"}
          </p>
        </div>
      </div>
    </div>
  );
}
