"use client";

import { useFormStatus } from "react-dom";
import clsx from "clsx";

export function SubmitButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={clsx(
        "inline-flex items-center justify-center rounded-xl bg-orange-700 dark:bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-800 dark:hover:bg-orange-500 disabled:opacity-60 transition-colors",
        className
      )}
    >
      {pending ? "Salvando..." : children}
    </button>
  );
}
