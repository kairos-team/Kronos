import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      subClients: { orderBy: { name: "asc" } },
      services: {
        orderBy: { createdAt: "asc" },
        include: { installments: { orderBy: { number: "asc" } } },
      },
    },
  });

  const payload = {
    exportedAt: new Date().toISOString(),
    system: "Kronos",
    version: 1,
    clients,
  };

  const filename = `kronos-backup-${new Date().toISOString().slice(0, 10)}.json`;

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
