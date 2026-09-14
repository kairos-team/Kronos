"use client";

import { Plus } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { ServiceForm } from "@/components/services/ServiceForm";

export function NewServiceModal({
  clientId,
  existingSubClients,
  fixedSubClient,
}: {
  clientId: string;
  existingSubClients?: string[];
  fixedSubClient?: { id: string; name: string };
}) {
  return (
    <Modal
      title="Novo serviço"
      trigger={
        <span className="inline-flex items-center gap-2 rounded-xl bg-orange-700 dark:bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-800 dark:hover:bg-orange-500 transition-colors">
          <Plus className="h-4 w-4" />
          Novo serviço
        </span>
      }
    >
      {(close) => (
        <ServiceForm
          clientId={clientId}
          onDone={close}
          existingSubClients={existingSubClients}
          fixedSubClient={fixedSubClient}
        />
      )}
    </Modal>
  );
}
