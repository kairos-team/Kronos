"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import clsx from "clsx";
import { Modal } from "@/components/ui/Modal";
import { ClientForm } from "@/components/clients/ClientForm";
import { NewSubClientForm } from "@/components/clients/NewSubClientForm";
import { createClient } from "@/lib/actions";

export function NewClientModal() {
  const [mode, setMode] = useState<"independent" | "subclient">("independent");

  return (
    <Modal
      title="Novo cliente"
      trigger={
        <span className="inline-flex items-center gap-2 rounded-xl bg-orange-700 dark:bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-800 dark:hover:bg-orange-500 transition-colors">
          <Plus className="h-4 w-4" />
          Novo cliente
        </span>
      }
    >
      {() => (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMode("independent")}
              className={clsx(
                "rounded-xl border px-3.5 py-2.5 text-sm font-medium text-left transition-colors",
                mode === "independent"
                  ? "border-orange-600 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400"
                  : "border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
              )}
            >
              Cliente independente
            </button>
            <button
              type="button"
              onClick={() => setMode("subclient")}
              className={clsx(
                "rounded-xl border px-3.5 py-2.5 text-sm font-medium text-left transition-colors",
                mode === "subclient"
                  ? "border-orange-600 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400"
                  : "border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
              )}
            >
              Cliente final de outro
            </button>
          </div>

          {mode === "independent" ? (
            <ClientForm action={createClient} submitLabel="Cadastrar cliente" />
          ) : (
            <NewSubClientForm />
          )}
        </div>
      )}
    </Modal>
  );
}
