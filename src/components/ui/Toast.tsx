"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import clsx from "clsx";

type ToastVariant = "success" | "error";
type ToastEntry = { id: number; message: string; variant: ToastVariant };
type ToastContextValue = { toast: (message: string, variant?: ToastVariant) => void };

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}

let nextToastId = 1;
const TOAST_DURATION_MS = 3000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  const toast = useCallback((message: string, variant: ToastVariant = "success") => {
    const id = nextToastId++;
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, TOAST_DURATION_MS);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 z-50 flex flex-col gap-2 items-center md:items-end w-full md:w-auto px-4 md:px-0 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={clsx(
              "pointer-events-auto flex items-center gap-2 rounded-xl border bg-white dark:bg-stone-800 px-4 py-3 text-sm font-medium text-stone-900 dark:text-stone-100 shadow-lg max-w-sm w-full md:w-auto",
              t.variant === "success"
                ? "border-green-200 dark:border-green-800"
                : "border-red-200 dark:border-red-800"
            )}
          >
            {t.variant === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />
            )}
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
