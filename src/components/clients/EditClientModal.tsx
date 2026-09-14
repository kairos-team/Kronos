"use client";

import { Pencil } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { ClientForm } from "@/components/clients/ClientForm";
import { useToast } from "@/components/ui/Toast";
import { updateClient } from "@/lib/actions";

type ClientData = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  document: string | null;
  notes: string | null;
};

export function EditClientModal({ client }: { client: ClientData }) {
  const boundUpdateClient = updateClient.bind(null, client.id);
  const { toast } = useToast();

  return (
    <Modal
      title="Editar cliente"
      trigger={
        <span className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2.5 text-sm font-medium text-stone-600 dark:text-stone-300 shadow-sm hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors">
          <Pencil className="h-3.5 w-3.5" />
          Editar
        </span>
      }
    >
      {(close) => {
        async function submit(formData: FormData) {
          await boundUpdateClient(formData);
          toast("Cliente atualizado com sucesso.");
          close();
        }

        return (
          <ClientForm
            action={submit}
            submitLabel="Salvar alterações"
            defaultValues={{
              name: client.name,
              email: client.email,
              phone: client.phone,
              document: client.document,
              notes: client.notes,
            }}
          />
        );
      }}
    </Modal>
  );
}
