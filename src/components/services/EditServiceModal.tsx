"use client";

import { Pencil } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { EditServiceForm } from "@/components/services/EditServiceForm";
import type { ServiceWithDetails } from "@/lib/queries";

export function EditServiceModal({
  service,
  clientId,
}: {
  service: ServiceWithDetails;
  clientId: string;
}) {
  return (
    <Modal
      title="Editar serviço"
      trigger={
        <span
          className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-stone-400 dark:text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-700 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
          aria-label="Editar serviço"
        >
          <Pencil className="h-4 w-4" />
        </span>
      }
    >
      {(close) => <EditServiceForm service={service} clientId={clientId} onDone={close} />}
    </Modal>
  );
}
