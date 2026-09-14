"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { deleteSubClient } from "@/lib/actions";

export function DeleteSubClientButton({
  subClientId,
  subClientName,
  masterClientId,
  masterClientName,
  servicesCount,
}: {
  subClientId: string;
  subClientName: string;
  masterClientId: string;
  masterClientName: string;
  servicesCount: number;
}) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  return (
    <Modal
      title="Excluir cliente final"
      trigger={
        <span className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 dark:border-red-900 bg-white dark:bg-stone-800 px-3.5 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 shadow-sm hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
          <Trash2 className="h-3.5 w-3.5" />
          Excluir
        </span>
      }
    >
      {(close) => (
        <div className="space-y-4">
          <p className="text-sm text-stone-600 dark:text-stone-300">
            Tem certeza que deseja excluir{" "}
            <span className="font-semibold text-stone-900 dark:text-stone-100">
              {subClientName}
            </span>
            ?{" "}
            {servicesCount > 0 ? (
              <>
                Os {servicesCount} serviço{servicesCount === 1 ? "" : "s"} vinculados a ele{" "}
                <span className="font-medium">não serão apagados</span> — voltam a aparecer em
                &quot;Outros serviços&quot; na página de {masterClientName}.
              </>
            ) : (
              "Essa ação não pode ser desfeita."
            )}
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={close}
              disabled={isPending}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 disabled:opacity-60 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                startTransition(async () => {
                  await deleteSubClient(subClientId, masterClientId);
                  toast(`Cliente final "${subClientName}" excluído.`);
                  router.push(`/clientes/${masterClientId}`);
                });
              }}
              className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-60 transition-colors"
            >
              {isPending ? "Excluindo..." : "Excluir definitivamente"}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
