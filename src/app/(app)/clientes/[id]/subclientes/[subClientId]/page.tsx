import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getSubClientDetail } from "@/lib/queries";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { NewServiceModal } from "@/components/services/NewServiceModal";
import { DeleteSubClientButton } from "@/components/clients/DeleteSubClientButton";
import { ServicesSection } from "@/components/services/ServicesSection";
import { formatCurrency } from "@/lib/format";

export default async function SubClientDetailPage({
  params,
}: {
  params: Promise<{ id: string; subClientId: string }>;
}) {
  const { id, subClientId } = await params;
  const subClient = await getSubClientDetail(subClientId);

  if (!subClient || subClient.clientId !== id) notFound();

  const totalContratado = subClient.services.reduce((sum, s) => sum + s.totalValue, 0);
  const totalRecebido = subClient.services.reduce(
    (sum, s) => sum + s.installments.filter((i) => i.paid).reduce((a, i) => a + i.value, 0),
    0
  );
  const totalPendente = totalContratado - totalRecebido;

  return (
    <div className="space-y-6">
      <Link
        href={`/clientes/${subClient.clientId}`}
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
      >
        <ArrowLeft className="h-4 w-4" />
        {subClient.client.name}
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar name={subClient.name} size="lg" />
          <div>
            <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
              {subClient.name}
            </h1>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
              Cliente final de {subClient.client.name}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <DeleteSubClientButton
            subClientId={subClient.id}
            subClientName={subClient.name}
            masterClientId={subClient.clientId}
            masterClientName={subClient.client.name}
            servicesCount={subClient.services.length}
          />
          <NewServiceModal
            clientId={subClient.clientId}
            fixedSubClient={{ id: subClient.id, name: subClient.name }}
          />
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

      <div className="space-y-4">
        <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">Serviços</h2>
        <ServicesSection
          services={subClient.services}
          clientId={subClient.clientId}
          showSubClientTag={false}
          emptyMessage="Nenhum serviço cadastrado para este cliente final ainda."
        />
      </div>
    </div>
  );
}
