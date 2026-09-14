import Link from "next/link";
import { Users, ChevronRight } from "lucide-react";
import { getClientsOverview } from "@/lib/queries";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { NewClientModal } from "@/components/clients/NewClientModal";
import { NewServiceQuickModal } from "@/components/services/NewServiceQuickModal";
import { ClientFilters } from "@/components/clients/ClientFilters";
import { formatCurrency, formatDate } from "@/lib/format";
import clsx from "clsx";

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; sort?: string }>;
}) {
  const { filter = "all", sort = "name" } = await searchParams;
  const allClients = await getClientsOverview();

  const counts = {
    all: allClients.length,
    ok: allClients.filter((c) => !c.hasOverdue).length,
    overdue: allClients.filter((c) => c.hasOverdue).length,
  };

  let clients = allClients;
  if (filter === "ok") clients = clients.filter((c) => !c.hasOverdue);
  if (filter === "overdue") clients = clients.filter((c) => c.hasOverdue);

  clients = [...clients].sort((a, b) => {
    if (sort === "value") return b.totalPendente - a.totalPendente;
    if (sort === "due") {
      if (!a.nextDueDate && !b.nextDueDate) return 0;
      if (!a.nextDueDate) return 1;
      if (!b.nextDueDate) return -1;
      return a.nextDueDate.getTime() - b.nextDueDate.getTime();
    }
    return a.name.localeCompare(b.name, "pt-BR");
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">Clientes</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            {allClients.length} cliente{allClients.length === 1 ? "" : "s"} cadastrado
            {allClients.length === 1 ? "" : "s"}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <NewServiceQuickModal />
          <NewClientModal />
        </div>
      </div>

      {allClients.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="h-12 w-12 rounded-2xl bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center">
            <Users className="h-6 w-6 text-orange-700 dark:text-orange-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
              Nenhum cliente ainda
            </p>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
              Cadastre seu primeiro cliente para começar.
            </p>
          </div>
        </Card>
      ) : (
        <>
          <ClientFilters counts={counts} />

          {clients.length === 0 ? (
            <Card className="py-12 text-center text-sm text-stone-500 dark:text-stone-400">
              Nenhum cliente nesse filtro.
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {clients.map((client) => (
                <Link key={client.id} href={`/clientes/${client.id}`}>
                  <Card className="p-5 h-full hover:border-orange-200 dark:hover:border-orange-900 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <Avatar name={client.name} size="md" />
                        <div className="min-w-0">
                          <p className="font-semibold text-stone-900 dark:text-stone-100 truncate">
                            {client.name}
                          </p>
                          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                            {client.servicesCount} serviço{client.servicesCount === 1 ? "" : "s"}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-stone-300 dark:text-stone-600 shrink-0 mt-1" />
                    </div>

                    <div className="mt-4 flex items-end justify-between gap-2">
                      <div>
                        <p className="text-xs text-stone-500 dark:text-stone-400">A receber</p>
                        <p className="text-lg font-semibold text-green-700 dark:text-green-400 tabular-nums">
                          {formatCurrency(client.totalPendente)}
                        </p>
                      </div>
                      {client.totalPendente > 0 && (
                        <span
                          className={clsx(
                            "shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                            client.hasOverdue
                              ? "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 ring-1 ring-red-600/20 dark:ring-red-500/30"
                              : "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 ring-1 ring-green-600/20 dark:ring-green-500/30"
                          )}
                        >
                          <span
                            className={clsx(
                              "h-1.5 w-1.5 rounded-full",
                              client.hasOverdue ? "bg-red-500" : "bg-green-500"
                            )}
                          />
                          {client.hasOverdue ? "Com atraso" : "Em dia"}
                        </span>
                      )}
                    </div>
                    {client.totalPendente > 0 && client.nextDueDate && (
                      <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">
                        Próx. venc. {formatDate(client.nextDueDate)}
                      </p>
                    )}
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
