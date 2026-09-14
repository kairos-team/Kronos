"use client";

import { useState } from "react";
import clsx from "clsx";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { labelClass, inputClass } from "@/components/ui/field-styles";
import { useToast } from "@/components/ui/Toast";
import { createService } from "@/lib/actions";

const today = new Date().toISOString().slice(0, 10);
const NEW_SUBCLIENT = "__new__";

export function ServiceForm({
  clientId,
  onDone,
  existingSubClients,
  fixedSubClient,
}: {
  clientId: string;
  onDone: () => void;
  existingSubClients?: string[];
  fixedSubClient?: { id: string; name: string };
}) {
  const [paymentType, setPaymentType] = useState<"UNICO" | "PARCELADO">("UNICO");
  const [subClientChoice, setSubClientChoice] = useState("");
  const boundCreateService = createService.bind(null, clientId);
  const { toast } = useToast();

  async function submit(formData: FormData) {
    await boundCreateService(formData);
    toast("Serviço cadastrado com sucesso.");
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
          className={inputClass}
          placeholder="Ex: Consultoria de marketing digital"
        />
      </div>

      {fixedSubClient ? (
        <div>
          <span className={labelClass}>Cliente final</span>
          <div className="rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 px-3.5 py-2.5 text-sm text-stone-700 dark:text-stone-300">
            {fixedSubClient.name}
          </div>
          <input type="hidden" name="subClientId" value={fixedSubClient.id} />
        </div>
      ) : (
        <div>
          <label className={labelClass} htmlFor="subClientChoice">
            Cliente final <span className="font-normal">(opcional)</span>
          </label>
          <select
            id="subClientChoice"
            value={subClientChoice}
            onChange={(event) => setSubClientChoice(event.target.value)}
            className={inputClass}
          >
            <option value="">Nenhum</option>
            {existingSubClients?.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
            <option value={NEW_SUBCLIENT}>+ Criar novo cliente final</option>
          </select>
          {subClientChoice === NEW_SUBCLIENT ? (
            <input
              name="subClientName"
              required
              autoFocus
              autoComplete="off"
              className={clsx(inputClass, "mt-2")}
              placeholder="Nome do novo cliente final"
            />
          ) : (
            <input type="hidden" name="subClientName" value={subClientChoice} />
          )}
        </div>
      )}

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
          className={inputClass}
          placeholder="0,00"
        />
      </div>

      <div>
        <span className={labelClass}>Modalidade de pagamento *</span>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setPaymentType("UNICO")}
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
            defaultValue={12}
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
          defaultValue={today}
          className={inputClass}
        />
      </div>

      <div className="flex justify-end pt-2">
        <SubmitButton>Cadastrar serviço</SubmitButton>
      </div>
    </form>
  );
}
