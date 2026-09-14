import { CheckCircle2, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ServiceProgressBar } from "@/components/services/ServiceProgressBar";
import { InstallmentTimelineItem } from "@/components/services/InstallmentTimelineItem";
import { DeleteServiceButton } from "@/components/services/DeleteServiceButton";
import { EditServiceModal } from "@/components/services/EditServiceModal";
import { formatCurrency, formatDate } from "@/lib/format";
import type { ServiceWithDetails } from "@/lib/queries";

function isServiceCompleted(service: ServiceWithDetails) {
  return service.installments.length > 0 && service.installments.every((i) => i.paid);
}

function ServiceCard({
  service,
  clientId,
  showSubClientTag,
}: {
  service: ServiceWithDetails;
  clientId: string;
  showSubClientTag: boolean;
}) {
  const paidCount = service.installments.filter((i) => i.paid).length;
  const isCompleted = isServiceCompleted(service);
  const isParcelado = service.paymentType === "PARCELADO";
  const nextPending = service.installments.find((i) => !i.paid);
  const subClientId = service.subClientId ?? undefined;

  const timeline = (
    <div className="mt-5">
      {service.installments.map((installment, index) => (
        <InstallmentTimelineItem
          key={installment.id}
          installment={installment}
          installmentsCount={service.installments.length}
          clientId={clientId}
          subClientId={subClientId}
          isLast={index === service.installments.length - 1}
        />
      ))}
    </div>
  );

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-medium text-stone-900 dark:text-stone-100">{service.description}</p>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 flex flex-wrap items-center gap-2">
            {service.paymentType === "UNICO"
              ? "Pagamento único"
              : `Parcelado em ${service.installmentsCount}x`}
            {showSubClientTag && service.subClient && (
              <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 dark:bg-stone-700 px-2 py-0.5 text-[11px] font-medium text-stone-600 dark:text-stone-300">
                Para: {service.subClient.name}
              </span>
            )}
            {isCompleted ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 dark:bg-green-950/30 px-2 py-0.5 text-[11px] font-medium text-green-700 dark:text-green-400 ring-1 ring-green-600/20 dark:ring-green-500/30">
                <CheckCircle2 className="h-3 w-3" />
                Concluído
              </span>
            ) : (
              isParcelado &&
              nextPending && (
                <span>
                  · Próxima: {formatDate(nextPending.dueDate)} ({formatCurrency(nextPending.value)})
                </span>
              )
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold text-stone-900 dark:text-stone-100 tabular-nums">
            {formatCurrency(service.totalValue)}
          </p>
          <EditServiceModal service={service} clientId={clientId} />
          <DeleteServiceButton
            serviceId={service.id}
            clientId={clientId}
            subClientId={subClientId}
            serviceDescription={service.description}
            installmentsCount={service.installments.length}
          />
        </div>
      </div>

      <div className="mt-4">
        <ServiceProgressBar paid={paidCount} total={service.installments.length} />
      </div>

      {isParcelado ? (
        <details className="group">
          <summary className="mt-4 flex items-center gap-1.5 text-sm font-medium text-stone-500 dark:text-stone-400 cursor-pointer hover:text-stone-700 dark:hover:text-stone-200 list-none">
            <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
            Ver cronograma completo ({paidCount}/{service.installments.length} pagas)
          </summary>
          {timeline}
        </details>
      ) : (
        timeline
      )}
    </Card>
  );
}

export function ServicesSection({
  services,
  clientId,
  showSubClientTag = true,
  emptyMessage = "Nenhum serviço cadastrado ainda.",
}: {
  services: ServiceWithDetails[];
  clientId: string;
  showSubClientTag?: boolean;
  emptyMessage?: string;
}) {
  if (services.length === 0) {
    return (
      <Card className="py-12 text-center text-sm text-stone-500 dark:text-stone-400">
        {emptyMessage}
      </Card>
    );
  }

  const activeServices = services.filter((s) => !isServiceCompleted(s));
  const historyServices = services.filter(isServiceCompleted);

  return (
    <div className="space-y-4">
      {activeServices.length === 0 ? (
        <Card className="py-8 text-center text-sm text-stone-500 dark:text-stone-400">
          Nenhum contrato ativo no momento.
        </Card>
      ) : (
        <div className="space-y-4">
          {activeServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              clientId={clientId}
              showSubClientTag={showSubClientTag}
            />
          ))}
        </div>
      )}

      {historyServices.length > 0 && (
        <details className="group/history">
          <summary className="flex items-center gap-1.5 text-sm font-medium text-stone-500 dark:text-stone-400 cursor-pointer hover:text-stone-700 dark:hover:text-stone-200 list-none">
            <ChevronDown className="h-4 w-4 transition-transform group-open/history:rotate-180" />
            Histórico ({historyServices.length} concluído
            {historyServices.length === 1 ? "" : "s"})
          </summary>
          <div className="mt-4 space-y-4">
            {historyServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                clientId={clientId}
                showSubClientTag={showSubClientTag}
              />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
