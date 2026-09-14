"use client";

import { useEffect, useState } from "react";
import { Plus, Search, ArrowLeft } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Avatar } from "@/components/ui/Avatar";
import { ServiceForm } from "@/components/services/ServiceForm";
import { inputClass } from "@/components/ui/field-styles";
import { useClientSearch, type ClientSearchResult } from "@/hooks/useClientSearch";

function ClientPicker({ onSelect }: { onSelect: (client: ClientSearchResult) => void }) {
  const [query, setQuery] = useState("");
  const results = useClientSearch(query);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
        <input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoComplete="off"
          placeholder="Buscar por nome, e-mail ou telefone..."
          className={`${inputClass} pl-10`}
        />
      </div>
      <div className="max-h-64 overflow-y-auto -mx-1">
        {query.trim() && results.length === 0 && (
          <p className="px-1 py-3 text-sm text-stone-500 dark:text-stone-400">Nenhum cliente encontrado.</p>
        )}
        {results.map((client) => (
          <button
            key={client.id}
            type="button"
            onClick={() => onSelect(client)}
            className="w-full flex items-center gap-3 px-1 py-2.5 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors text-left"
          >
            <Avatar name={client.name} size="sm" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">{client.name}</p>
              {client.email && (
                <p className="text-xs text-stone-500 dark:text-stone-400 truncate">{client.email}</p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function NewServiceQuickModal() {
  const [selected, setSelected] = useState<ClientSearchResult | null>(null);
  const [existingSubClients, setExistingSubClients] = useState<string[]>([]);

  useEffect(() => {
    if (!selected) return;
    fetch(`/api/clients/${selected.id}/subclients`)
      .then((res) => res.json())
      .then((data: { id: string; name: string }[]) => setExistingSubClients(data.map((s) => s.name)))
      .catch(() => setExistingSubClients([]));
  }, [selected]);

  return (
    <Modal
      title={selected ? "Novo serviço" : "Selecione o cliente"}
      trigger={
        <span className="inline-flex items-center gap-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 px-4 py-2.5 text-sm font-semibold text-stone-700 dark:text-stone-200 shadow-sm hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors">
          <Plus className="h-4 w-4" />
          Novo serviço
        </span>
      }
    >
      {(close) => {
        function handleDone() {
          setSelected(null);
          setExistingSubClients([]);
          close();
        }

        if (!selected) {
          return <ClientPicker onSelect={setSelected} />;
        }

        return (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => {
                setSelected(null);
                setExistingSubClients([]);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Trocar cliente
            </button>
            <div className="flex items-center gap-3 rounded-xl bg-stone-50 dark:bg-stone-900 px-3.5 py-2.5">
              <Avatar name={selected.name} size="sm" />
              <p className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">{selected.name}</p>
            </div>
            <ServiceForm
              clientId={selected.id}
              onDone={handleDone}
              existingSubClients={existingSubClients}
            />
          </div>
        );
      }}
    </Modal>
  );
}
