"use client";

import { useTransition } from "react";
import { Paperclip, Download, Trash2 } from "lucide-react";
import clsx from "clsx";
import { Modal } from "@/components/ui/Modal";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { useToast } from "@/components/ui/Toast";
import { attachReceipt, removeReceipt } from "@/lib/actions";

export function InstallmentReceiptButton({
  installmentId,
  clientId,
  subClientId,
  fileName,
}: {
  installmentId: string;
  clientId: string;
  subClientId?: string;
  fileName: string | null;
}) {
  const hasReceipt = !!fileName;
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const boundAttachReceipt = attachReceipt.bind(null, installmentId, clientId, subClientId);

  async function handleUpload(formData: FormData) {
    await boundAttachReceipt(formData);
    toast("Comprovante anexado.");
  }

  function handleRemove(close: () => void) {
    startTransition(async () => {
      await removeReceipt(installmentId, clientId, subClientId);
      toast("Comprovante removido.");
      close();
    });
  }

  return (
    <Modal
      title={hasReceipt ? "Comprovante de pagamento" : "Anexar comprovante"}
      trigger={
        <span
          className={clsx(
            "flex items-center justify-center h-7 w-7 rounded-lg transition-colors",
            hasReceipt
              ? "text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/30"
              : "text-stone-400 dark:text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-700"
          )}
          aria-label={hasReceipt ? "Ver comprovante" : "Anexar comprovante"}
        >
          <Paperclip className="h-3.5 w-3.5" />
        </span>
      }
    >
      {(close) =>
        hasReceipt ? (
          <div className="space-y-4">
            <a
              href={`/api/installments/${installmentId}/receipt`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 px-4 py-3 text-sm font-medium text-orange-700 dark:text-orange-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <Download className="h-4 w-4 shrink-0" />
              <span className="truncate">{fileName}</span>
            </a>
            <div className="flex justify-end">
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleRemove(close)}
                className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-60 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                {isPending ? "Removendo..." : "Remover comprovante"}
              </button>
            </div>
          </div>
        ) : (
          <form
            action={async (formData) => {
              await handleUpload(formData);
              close();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                Arquivo (imagem ou PDF, até 3MB)
              </label>
              <input
                type="file"
                name="receipt"
                accept="image/png,image/jpeg,image/webp,application/pdf"
                required
                className="block w-full text-sm text-stone-600 dark:text-stone-300 file:mr-3 file:rounded-lg file:border-0 file:bg-stone-100 dark:file:bg-stone-700 file:px-3 file:py-2 file:text-sm file:font-medium file:text-stone-700 dark:file:text-stone-200 hover:file:bg-stone-200 dark:hover:file:bg-stone-600 cursor-pointer"
              />
            </div>
            <div className="flex justify-end">
              <SubmitButton>Anexar</SubmitButton>
            </div>
          </form>
        )
      }
    </Modal>
  );
}
