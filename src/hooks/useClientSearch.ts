"use client";

import { useEffect, useState } from "react";

export type ClientSearchResult = { id: string; name: string; email: string | null };

export function useClientSearch(query: string) {
  const [defaultResults, setDefaultResults] = useState<ClientSearchResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<ClientSearchResult[]>([]);

  useEffect(() => {
    fetch("/api/clients/search?q=")
      .then((res) => res.json())
      .then(setDefaultResults)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!query.trim()) return;

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      fetch(`/api/clients/search?q=${encodeURIComponent(query)}`, {
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then(setFilteredResults)
        .catch(() => {});
    }, 200);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  return query.trim() ? filteredResults : defaultResults;
}
