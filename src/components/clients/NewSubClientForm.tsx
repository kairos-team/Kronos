"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { labelClass, inputClass } from "@/components/ui/field-styles";
import { useClientSearch, type ClientSearchResult } from "@/hooks/useClientSearch";
import { createSubClient } from "@/lib/actions";

export function NewSubClientForm() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ClientSearchResult | null>(null);
  const results = useClientSearch(query);

  if (!selected) {
    return (
      <div className="space-y-3">
        <div>
          <label className={labelClass} htmlFor="masterClientQuery">
            Cliente existente *
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              id="masterClientQuery"
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
              placeholder="Buscar cliente..."
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>
        <div className="max-h-64 overflow-y-auto -mx-1">
          {query.trim() && results.length === 0 && (
            <p className="px-1 py-3 text-sm text-stone-500 dark:text-stone-400">
              Nenhum cliente encontrado.
            </p>
          )}
          {results.map((client) => (
            <button
              key={client.id}
              type="button"
              onClick={() => setSelected(client)}
              className="w-full flex items-center gap-3 px-1 py-2.5 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors text-left"
            >
              <Avatar name={client.name} size="sm" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">
                  {client.name}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const boundCreateSubClient = createSubClient.bind(null, selected.id);

  return (
    <form action={boundCreateSubClient} className="space-y-4">
      <div className="flex items-center gap-3 rounded-xl bg-stone-50 dark:bg-stone-900 px-3.5 py-2.5">
        <Avatar name={selected.name} size="sm" />
        <p className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">
          {selected.name}
        </p>
        <button
          type="button"
          onClick={() => setSelected(null)}
          className="ml-auto text-xs font-medium text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
        >
          Trocar
        </button>
      </div>
      <div>
        <label className={labelClass} htmlFor="name">
          Nome do cliente final *
        </label>
        <input
          id="name"
          name="name"
          required
          autoFocus
          autoComplete="off"
          className={inputClass}
          placeholder="Ex: Invictus"
        />
      </div>
      <div className="flex justify-end pt-2">
        <SubmitButton>Cadastrar</SubmitButton>
      </div>
    </form>
  );
}
