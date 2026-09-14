"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { deleteService } from "@/lib/actions";

export function DeleteServiceButton({
  serviceId,
  clientId,
  subClientId,
  serviceDescription,
  installmentsCount,
}: {
  serviceId: string;
  clientId: string;
  subClientId?: string;
  serviceDescription: string;
  installmentsCount: number;
}) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  return (
    <Modal
      title="Excluir serviço"
      trigger={
        <span
          className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-stone-400 dark:text-stone-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          aria-label="Excluir serviço"
        >
          <Trash2 className="h-4 w-4" />
        </span>
      }
    >
      {(close) => (
        <div className="space-y-4">
          <p className="text-sm text-stone-600 dark:text-stone-300">
            Tem certeza que deseja excluir{" "}
            <span className="font-semibold text-stone-900 dark:text-stone-100">
              {serviceDescription}
            </span>
            ? As {installmentsCount} parcela{installmentsCount === 1 ? "" : "s"} desse serviço
            serão apagadas permanentemente. Essa ação não pode ser desfeita.
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
                  await deleteService(serviceId, clientId, subClientId);
                  toast("Serviço excluído.");
                  close();
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
