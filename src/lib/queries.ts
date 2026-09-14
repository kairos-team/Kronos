import { prisma } from "@/lib/prisma";
import { startOfToday, startOfUTCMonth } from "@/lib/installments";

export async function getClientsOverview() {
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
    include: { services: { include: { installments: true } } },
  });

  const today = startOfToday();

  return clients.map((client) => {
    const allInstallments = client.services.flatMap((s) => s.installments);
    const pending = allInstallments.filter((i) => !i.paid);
    const totalContratado = client.services.reduce((sum, s) => sum + s.totalValue, 0);
    const totalPendente = pending.reduce((sum, i) => sum + i.value, 0);
    const nextDueDate = pending
      .map((i) => i.dueDate)
      .sort((a, b) => a.getTime() - b.getTime())[0];
    const hasOverdue = pending.some((i) => i.dueDate < today);

    return {
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      servicesCount: client.services.length,
      totalContratado,
      totalPendente,
      nextDueDate: nextDueDate ?? null,
      hasOverdue,
    };
  });
}

export async function getClientDetail(id: string) {
  return prisma.client.findUnique({
    where: { id },
    include: {
      subClients: { orderBy: { name: "asc" } },
      services: {
        orderBy: { createdAt: "desc" },
        include: {
          installments: { orderBy: { number: "asc" } },
          subClient: true,
        },
      },
    },
  });
}

export type ServiceWithDetails = NonNullable<
  Awaited<ReturnType<typeof getClientDetail>>
>["services"][number];

export async function getSubClientNames(clientId: string) {
  return prisma.subClient.findMany({
    where: { clientId },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}

export async function getSubClientDetail(subClientId: string) {
  return prisma.subClient.findUnique({
    where: { id: subClientId },
    include: {
      client: true,
      services: {
        orderBy: { createdAt: "desc" },
        include: {
          installments: { orderBy: { number: "asc" } },
          subClient: true,
        },
      },
    },
  });
}

export async function searchClients(query: string) {
  const trimmed = query.trim();

  if (!trimmed) {
    return prisma.client.findMany({
      orderBy: { name: "asc" },
      take: 8,
      select: { id: true, name: true, email: true },
    });
  }

  return prisma.client.findMany({
    where: {
      OR: [
        { name: { contains: trimmed } },
        { email: { contains: trimmed } },
        { phone: { contains: trimmed } },
        { document: { contains: trimmed } },
      ],
    },
    orderBy: { name: "asc" },
    take: 8,
    select: { id: true, name: true, email: true },
  });
}

function percentChange(current: number, previous: number): number | null {
  if (previous <= 0) return null;
  return Math.round(((current - previous) / previous) * 100);
}

export async function getDashboardData() {
  const today = startOfToday();
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  const monthStart = startOfUTCMonth(0);
  const monthEnd = startOfUTCMonth(1);
  const prevMonthStart = startOfUTCMonth(-1);
  const nextMonthEnd = startOfUTCMonth(2);
  const sevenDaysAhead = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  const installments = await prisma.installment.findMany({
    include: { service: { include: { client: true } } },
    orderBy: { dueDate: "asc" },
  });

  const sumInRange = (start: Date, end: Date) =>
    installments
      .filter((i) => i.dueDate >= start && i.dueDate < end)
      .reduce((sum, i) => sum + i.value, 0);

  const sumPendingInRange = (start: Date, end: Date) =>
    installments
      .filter((i) => !i.paid && i.dueDate >= start && i.dueDate < end)
      .reduce((sum, i) => sum + i.value, 0);

  const previstoNoMes = sumPendingInRange(monthStart, monthEnd);
  const previstoMesAnterior = sumPendingInRange(prevMonthStart, monthStart);
  const previstoProximoMes = sumPendingInRange(monthEnd, nextMonthEnd);

  const pendentes = installments.filter((i) => !i.paid);
  const servicosAtivos = new Set(pendentes.map((i) => i.serviceId)).size;
  const clientesAtivos = new Set(pendentes.map((i) => i.service.clientId)).size;
  const totalAReceber = pendentes.reduce((sum, i) => sum + i.value, 0);

  const vencimentosHoje = pendentes.filter((i) => i.dueDate.getTime() === today.getTime());
  const vencimentosProximos7Dias = pendentes.filter(
    (i) => i.dueDate >= tomorrow && i.dueDate <= sevenDaysAhead
  );

  const monthlyBreakdown = Array.from({ length: 6 }, (_, index) => {
    const offset = 5 - index;
    const start = startOfUTCMonth(-offset);
    const end = startOfUTCMonth(-offset + 1);
    const previsto = sumInRange(start, end);
    const recebido = installments
      .filter((i) => i.paid && i.paidAt && i.paidAt >= start && i.paidAt < end)
      .reduce((sum, i) => sum + i.value, 0);
    return { month: start, previsto, recebido };
  });

  const totalClients = await prisma.client.count();

  return {
    previstoNoMes,
    previstoProximoMes,
    previstoVsMesAnteriorPct: percentChange(previstoNoMes, previstoMesAnterior),
    proximoMesVsAtualPct: percentChange(previstoProximoMes, previstoNoMes),
    clientesAtivos,
    servicosAtivos,
    totalAReceber,
    vencimentosHoje,
    vencimentosProximos7Dias,
    monthlyBreakdown,
    totalClients,
  };
}

export async function getRecentActivity(limit = 6) {
  return prisma.installment.findMany({
    where: { paid: true },
    orderBy: { paidAt: "desc" },
    take: limit,
    include: { service: { include: { client: true } } },
  });
}
