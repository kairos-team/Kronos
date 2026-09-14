import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, IdCard, ChevronRight } from "lucide-react";
import { getClientDetail } from "@/lib/queries";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { NewServiceModal } from "@/components/services/NewServiceModal";
import { ServicesSection } from "@/components/services/ServicesSection";
import { EditClientModal } from "@/components/clients/EditClientModal";
import { DeleteClientButton } from "@/components/clients/DeleteClientButton";
import { formatCurrency } from "@/lib/format";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await getClientDetail(id);

  if (!client) notFound();

  const totalContratado = client.services.reduce((sum, s) => sum + s.totalValue, 0);
  const totalRecebido = client.services.reduce(
    (sum, s) => sum + s.installments.filter((i) => i.paid).reduce((a, i) => a + i.value, 0),
    0
  );
  const totalPendente = totalContratado - totalRecebido;
  const existingSubClientNames = client.subClients.map((s) => s.name);
  const servicesWithoutSubClient = client.services.filter((s) => !s.subClientId);

  const subClientSummaries = client.subClients.map((sub) => {
    const subServices = client.services.filter((s) => s.subClientId === sub.id);
    const subPendente = subServices.reduce(
      (sum, s) => sum + s.installments.filter((i) => !i.paid).reduce((a, i) => a + i.value, 0),
      0
    );
    const activeCount = subServices.filter(
      (s) => !(s.installments.length > 0 && s.installments.every((i) => i.paid))
    ).length;
    return {
      id: sub.id,
      name: sub.name,
      servicesCount: subServices.length,
      activeCount,
      totalPendente: subPendente,
    };
  });

  return (
    <div className="space-y-6">
      <Link
        href="/clientes"
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
      >
        <ArrowLeft className="h-4 w-4" />
        Clientes
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar name={client.name} size="lg" />
          <div>
            <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
              {client.name}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-stone-500 dark:text-stone-400">
              {client.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> {client.email}
                </span>
              )}
              {client.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" /> {client.phone}
                </span>
              )}
              {client.document && (
                <span className="flex items-center gap-1.5">
                  <IdCard className="h-3.5 w-3.5" /> {client.document}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <EditClientModal client={client} />
          <DeleteClientButton clientId={client.id} clientName={client.name} />
          <NewServiceModal clientId={client.id} existingSubClients={existingSubClientNames} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-xs text-stone-500 dark:text-stone-400">Contratado</p>
          <p className="text-lg font-semibold text-stone-900 dark:text-stone-100 tabular-nums mt-1">
            {formatCurrency(totalContratado)}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-stone-500 dark:text-stone-400">Recebido</p>
          <p className="text-lg font-semibold text-green-700 dark:text-green-400 tabular-nums mt-1">
            {formatCurrency(totalRecebido)}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-stone-500 dark:text-stone-400">Pendente</p>
          <p className="text-lg font-semibold text-stone-900 dark:text-stone-100 tabular-nums mt-1">
            {formatCurrency(totalPendente)}
          </p>
        </Card>
      </div>

      {subClientSummaries.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">
            Clientes finais
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {subClientSummaries.map((sub) => (
              <Link key={sub.id} href={`/clientes/${client.id}/subclientes/${sub.id}`}>
                <Card className="p-5 h-full hover:border-orange-200 dark:hover:border-orange-900 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <Avatar name={sub.name} size="md" />
                      <div className="min-w-0">
                        <p className="font-semibold text-stone-900 dark:text-stone-100 truncate">
                          {sub.name}
                        </p>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                          {sub.servicesCount} serviço{sub.servicesCount === 1 ? "" : "s"}
                          {sub.activeCount > 0 &&
                            ` · ${sub.activeCount} ativo${sub.activeCount === 1 ? "" : "s"}`}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-stone-300 dark:text-stone-600 shrink-0 mt-1" />
                  </div>
                  <div className="mt-4">
                    <p className="text-xs text-stone-500 dark:text-stone-400">A receber</p>
                    <p className="text-lg font-semibold text-green-700 dark:text-green-400 tabular-nums">
                      {formatCurrency(sub.totalPendente)}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {(subClientSummaries.length === 0 || servicesWithoutSubClient.length > 0) && (
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">
            {subClientSummaries.length > 0 ? "Outros serviços" : "Serviços"}
          </h2>
          <ServicesSection
            services={subClientSummaries.length > 0 ? servicesWithoutSubClient : client.services}
            clientId={client.id}
            emptyMessage="Nenhum serviço cadastrado para este cliente ainda."
          />
        </div>
      )}
    </div>
  );
}
