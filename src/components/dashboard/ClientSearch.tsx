"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, Users } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { useClientSearch } from "@/hooks/useClientSearch";

export function ClientSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const results = useClientSearch(query);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setOpen(true)}
          autoComplete="off"
          placeholder="Buscar por nome, e-mail ou telefone... ou clique para ver todos"
          className="w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 pl-10 pr-4 py-3 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500"
        />
      </div>

      {open && (
        <div className="absolute z-10 mt-2 w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 shadow-lg overflow-hidden">
          {query.trim() && results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-stone-500 dark:text-stone-400">Nenhum cliente encontrado.</p>
          ) : (
            <div className="max-h-72 overflow-y-auto">
              {results.map((client) => (
                <Link
                  key={client.id}
                  href={`/clientes/${client.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <Avatar name={client.name} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">{client.name}</p>
                    {client.email && (
                      <p className="text-xs text-stone-500 dark:text-stone-400 truncate">{client.email}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
          <Link
            href="/clientes"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-orange-700 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 border-t border-stone-100 dark:border-stone-700 transition-colors"
          >
            <Users className="h-4 w-4" />
            Ver todos os clientes
          </Link>
        </div>
      )}
    </div>
  );
}
