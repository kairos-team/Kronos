"use client";

import { useState } from "react";
import clsx from "clsx";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { labelClass, inputClass } from "@/components/ui/field-styles";
import { useToast } from "@/components/ui/Toast";
import { updateService } from "@/lib/actions";
import type { ServiceWithDetails } from "@/lib/queries";

export function EditServiceForm({
  service,
  clientId,
  onDone,
}: {
  service: ServiceWithDetails;
  clientId: string;
  onDone: () => void;
}) {
  const hasPaidInstallments = service.installments.some((i) => i.paid);
  const [paymentType, setPaymentType] = useState<"UNICO" | "PARCELADO">(service.paymentType);
  const boundUpdateService = updateService.bind(
    null,
    service.id,
    clientId,
    service.subClientId ?? undefined
  );
  const { toast } = useToast();

  async function submit(formData: FormData) {
    await boundUpdateService(formData);
    toast("Serviço atualizado com sucesso.");
    onDone();
  }

  return (
    <form action={submit} className="space-y-4">
      <div>
        <label className={labelClass} htmlFor="description">
          Descrição do serviço *
        </label>
        <input
          id="description"
          name="description"
          required
          defaultValue={service.description}
          className={inputClass}
        />
      </div>

      {hasPaidInstallments && (
        <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 rounded-lg px-3 py-2.5">
          Esse serviço já tem parcelas pagas — valor, modalidade, número de parcelas e data não
          podem mais ser alterados. Só a descrição.
        </p>
      )}

      <fieldset disabled={hasPaidInstallments} className={clsx("space-y-4", hasPaidInstallments && "opacity-50")}>
        <div>
          <label className={labelClass} htmlFor="totalValue">
            Valor total (R$) *
          </label>
          <input
            id="totalValue"
            name="totalValue"
            type="number"
            step="0.01"
            min="0.01"
            required
            defaultValue={service.totalValue}
            className={inputClass}
          />
        </div>

        <div>
          <span className={labelClass}>Modalidade de pagamento *</span>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentType("UNICO")}
              disabled={hasPaidInstallments}
              className={clsx(
                "rounded-xl border px-3.5 py-2.5 text-sm font-medium text-left transition-colors",
                paymentType === "UNICO"
                  ? "border-orange-600 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400"
                  : "border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
              )}
            >
              Pagamento único
            </button>
            <button
              type="button"
              onClick={() => setPaymentType("PARCELADO")}
              disabled={hasPaidInstallments}
              className={clsx(
                "rounded-xl border px-3.5 py-2.5 text-sm font-medium text-left transition-colors",
                paymentType === "PARCELADO"
                  ? "border-orange-600 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400"
                  : "border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
              )}
            >
              Parcelado (mês a mês)
            </button>
          </div>
          <input type="hidden" name="paymentType" value={paymentType} />
        </div>

        {paymentType === "PARCELADO" && (
          <div>
            <label className={labelClass} htmlFor="installmentsCount">
              Número de parcelas *
            </label>
            <input
              id="installmentsCount"
              name="installmentsCount"
              type="number"
              min="2"
              step="1"
              required
              defaultValue={service.installmentsCount}
              className={inputClass}
            />
          </div>
        )}

        <div>
          <label className={labelClass} htmlFor="firstPaymentDate">
            Data do primeiro pagamento *
          </label>
          <input
            id="firstPaymentDate"
            name="firstPaymentDate"
            type="date"
            required
            defaultValue={service.firstPaymentDate.toISOString().slice(0, 10)}
            className={inputClass}
          />
        </div>
      </fieldset>

      <div className="flex justify-end pt-2">
        <SubmitButton>Salvar alterações</SubmitButton>
      </div>
    </form>
  );
}
