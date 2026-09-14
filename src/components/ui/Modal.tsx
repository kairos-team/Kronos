"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";

export function Modal({
  trigger,
  title,
  children,
}: {
  trigger: ReactNode;
  title: string;
  children: (close: () => void) => ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function close() {
    setOpen(false);
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        {trigger}
      </button>
      <dialog
        ref={dialogRef}
        onClose={close}
        onCancel={close}
        className="backdrop:bg-stone-950/40 dark:backdrop:bg-black/60 bg-transparent p-0 m-auto w-[calc(100%-2rem)] max-w-lg open:flex"
      >
        {open && (
          <div className="w-full rounded-2xl bg-white dark:bg-stone-800 shadow-xl border border-stone-200 dark:border-stone-700 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 dark:border-stone-700">
              <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">{title}</h2>
              <button
                type="button"
                onClick={close}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg p-1"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-5 overflow-y-auto">{children(close)}</div>
          </div>
        )}
      </dialog>
    </>
  );
}
