"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { generateInstallments } from "@/lib/installments";
import type { PaymentType } from "@/generated/prisma/enums";

function parseDateInput(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

export async function createClient(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    throw new Error("Nome do cliente é obrigatório.");
  }

  const client = await prisma.client.create({
    data: {
      name,
      email: emptyToNull(formData.get("email")),
      phone: emptyToNull(formData.get("phone")),
      document: emptyToNull(formData.get("document")),
      notes: emptyToNull(formData.get("notes")),
    },
  });

  revalidatePath("/clientes");
  redirect(`/clientes/${client.id}`);
}

export async function createSubClient(masterClientId: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    throw new Error("Nome do cliente final é obrigatório.");
  }

  const subClient = await prisma.subClient.upsert({
    where: { clientId_name: { clientId: masterClientId, name } },
    update: {},
    create: { clientId: masterClientId, name },
  });

  revalidatePath(`/clientes/${masterClientId}`);
  revalidatePath("/clientes");
  redirect(`/clientes/${masterClientId}/subclientes/${subClient.id}`);
}

export async function updateClient(clientId: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    throw new Error("Nome do cliente é obrigatório.");
  }

  await prisma.client.update({
    where: { id: clientId },
    data: {
      name,
      email: emptyToNull(formData.get("email")),
      phone: emptyToNull(formData.get("phone")),
      document: emptyToNull(formData.get("document")),
      notes: emptyToNull(formData.get("notes")),
    },
  });

  revalidatePath(`/clientes/${clientId}`);
  revalidatePath("/clientes");
  revalidatePath("/");
}

export async function deleteClient(clientId: string) {
  await prisma.client.delete({ where: { id: clientId } });

  revalidatePath("/clientes");
  revalidatePath("/");
}

export async function createService(clientId: string, formData: FormData) {
  const description = String(formData.get("description") ?? "").trim();
  const totalValue = Number(formData.get("totalValue"));
  const paymentType = String(formData.get("paymentType")) as PaymentType;
  const installmentsCountRaw = Number(formData.get("installmentsCount") ?? 1);
  const firstPaymentDate = parseDateInput(String(formData.get("firstPaymentDate")));
  const fixedSubClientId = String(formData.get("subClientId") ?? "").trim();
  const subClientName = String(formData.get("subClientName") ?? "").trim();

  if (!description) throw new Error("Descrição do serviço é obrigatória.");
  if (!totalValue || totalValue <= 0) throw new Error("Valor total inválido.");
  if (paymentType !== "UNICO" && paymentType !== "PARCELADO") {
    throw new Error("Modalidade de pagamento inválida.");
  }

  const installmentsCount =
    paymentType === "UNICO" ? 1 : Math.max(2, Math.round(installmentsCountRaw));

  const schedule = generateInstallments(
    totalValue,
    paymentType,
    installmentsCount,
    firstPaymentDate
  );

  let subClientId: string | null = fixedSubClientId || null;
  if (!subClientId && subClientName) {
    const subClient = await prisma.subClient.upsert({
      where: { clientId_name: { clientId, name: subClientName } },
      update: {},
      create: { clientId, name: subClientName },
    });
    subClientId = subClient.id;
  }

  await prisma.service.create({
    data: {
      clientId,
      subClientId,
      description,
      totalValue,
      paymentType,
      installmentsCount,
      firstPaymentDate,
      installments: {
        create: schedule.map((item) => ({
          number: item.number,
          dueDate: item.dueDate,
          value: item.value,
        })),
      },
    },
  });

  revalidatePath(`/clientes/${clientId}`);
  if (subClientId) {
    revalidatePath(`/clientes/${clientId}/subclientes/${subClientId}`);
  }
  revalidatePath("/");
}

export async function deleteService(serviceId: string, clientId: string, subClientId?: string) {
  await prisma.service.delete({ where: { id: serviceId } });

  revalidatePath(`/clientes/${clientId}`);
  if (subClientId) {
    revalidatePath(`/clientes/${clientId}/subclientes/${subClientId}`);
  }
  revalidatePath("/");
}

export async function toggleInstallmentPaid(
  installmentId: string,
  paid: boolean,
  clientId: string,
  subClientId?: string
) {
  await prisma.installment.update({
    where: { id: installmentId },
    data: { paid, paidAt: paid ? new Date() : null },
  });

  revalidatePath(`/clientes/${clientId}`);
  if (subClientId) {
    revalidatePath(`/clientes/${clientId}/subclientes/${subClientId}`);
  }
  revalidatePath("/");
}

function emptyToNull(value: FormDataEntryValue | null): string | null {
  const str = String(value ?? "").trim();
  return str.length > 0 ? str : null;
}
