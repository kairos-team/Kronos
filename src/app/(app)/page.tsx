import Link from "next/link";
import {
  Wallet,
  TrendingUp,
  FileText,
  Users,
  AlertTriangle,
  Sparkles,
  PiggyBank,
  BellRing,
} from "lucide-react";
import { getDashboardData, getRecentActivity } from "@/lib/queries";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { ClientSearch } from "@/components/dashboard/ClientSearch";
import { ReceivablesChart } from "@/components/dashboard/ReceivablesChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Card } from "@/components/ui/Card";
import { NewClientModal } from "@/components/clients/NewClientModal";
import { formatCurrency, formatDate } from "@/lib/format";

const ALERT_VISIBLE_LIMIT = 5;

export default async function DashboardPage() {
  const {
    previstoNoMes,
    previstoProximoMes,
    previstoVsMesAnteriorPct,
    proximoMesVsAtualPct,
    clientesAtivos,
    servicosAtivos,
    totalAReceber,
    vencimentosHoje,
    vencimentosProximos7Dias,
    monthlyBreakdown,
    totalClients,
  } = await getDashboardData();

  if (totalClients === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">Dashboard</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Visão geral dos seus recebimentos.
          </p>
        </div>

        <Card className="flex flex-col items-center justify-center gap-4 py-16 px-6 text-center">
          <div className="h-14 w-14 rounded-2xl bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center">
            <Sparkles className="h-7 w-7 text-orange-700 dark:text-orange-400" />
          </div>
          <div>
            <p className="text-base font-semibold text-stone-900 dark:text-stone-100">
              Bem-vindo ao Kronos
            </p>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-sm">
              Cadastre seu primeiro cliente para começar a acompanhar contratos, parcelas e
              recebimentos em um só lugar.
            </p>
          </div>
          <NewClientModal />
        </Card>
      </div>
    );
  }

  const recentActivity = await getRecentActivity();
  const visibleAlerts = vencimentosProximos7Dias.slice(0, ALERT_VISIBLE_LIMIT);
  const hiddenAlertsCount = vencimentosProximos7Dias.length - visibleAlerts.length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">Dashboard</h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          Visão geral dos seus recebimentos.
        </p>
      </div>

      <ClientSearch />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <SummaryCard
          label="Previsto neste mês"
          value={formatCurrency(previstoNoMes)}
          icon={Wallet}
          deltaPct={previstoVsMesAnteriorPct}
          deltaLabel="vs. mês passado"
        />
        <SummaryCard
          label="Previsão próximo mês"
          value={formatCurrency(previstoProximoMes)}
          icon={TrendingUp}
          accent="slate"
          deltaPct={proximoMesVsAtualPct}
          deltaLabel="vs. este mês"
        />
        <SummaryCard
          label="Contratos ativos"
          value={String(clientesAtivos)}
          icon={Users}
          accent="slate"
        />
        <SummaryCard
          label="Serviços ativos"
          value={String(servicosAtivos)}
          icon={FileText}
          accent="slate"
        />
        <SummaryCard
          label="Total a receber"
          value={formatCurrency(totalAReceber)}
          icon={PiggyBank}
          accent="slate"
        />
      </div>

      {vencimentosHoje.length > 0 && (
        <Card className="border-red-200 dark:border-red-900 bg-red-50/70 dark:bg-red-950/20">
          <div className="flex items-start gap-3 px-5 py-4">
            <BellRing className="h-[18px] w-[18px] text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-red-900 dark:text-red-200">
                {vencimentosHoje.length} pagamento{vencimentosHoje.length === 1 ? "" : "s"} vence
                {vencimentosHoje.length === 1 ? "" : "m"} hoje
              </p>
              <ul className="mt-2 space-y-1.5">
                {vencimentosHoje.map((installment) => (
                  <li key={installment.id}>
                    <Link
                      href={`/clientes/${installment.service.clientId}`}
                      className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 text-sm text-red-900 dark:text-red-200 hover:underline"
                    >
                      <span className="truncate">
                        {installment.service.client.name} · {installment.service.description}
                      </span>
                      <span className="shrink-0 font-medium tabular-nums">
                        {formatCurrency(installment.value)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {visibleAlerts.length > 0 && (
        <Card className="border-amber-200 dark:border-amber-900 bg-amber-50/60 dark:bg-amber-950/20">
          <div className="flex items-start gap-3 px-5 py-4">
            <AlertTriangle className="h-[18px] w-[18px] text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                {vencimentosProximos7Dias.length} vencimento
                {vencimentosProximos7Dias.length === 1 ? "" : "s"} nos próximos dias
              </p>
              <ul className="mt-2 space-y-1.5">
                {visibleAlerts.map((installment) => (
                  <li key={installment.id}>
                    <Link
                      href={`/clientes/${installment.service.clientId}`}
                      className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 text-sm text-amber-900 dark:text-amber-200 hover:underline"
                    >
                      <span className="truncate">
                        {installment.service.client.name} · {installment.service.description}
                      </span>
                      <span className="shrink-0 font-medium tabular-nums">
                        {formatCurrency(installment.value)} · {formatDate(installment.dueDate)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              {hiddenAlertsCount > 0 && (
                <p className="mt-2 text-xs text-amber-700 dark:text-amber-400">
                  +{hiddenAlertsCount} outro{hiddenAlertsCount === 1 ? "" : "s"} vencimento
                  {hiddenAlertsCount === 1 ? "" : "s"}.
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100 mb-4">
            Recebimentos por mês
          </h2>
          <ReceivablesChart data={monthlyBreakdown} />
        </Card>
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100 mb-1">
            Atividade recente
          </h2>
          <RecentActivity activity={recentActivity} />
        </Card>
      </div>
    </div>
  );
}
