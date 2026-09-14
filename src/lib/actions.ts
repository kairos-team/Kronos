"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { generateInstallments } from "@/lib/installments";
import type { PaymentType } from "@/generated/prisma/enums";

function parseDateInput(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

export async function createClient(formData: FormData) {
  await requireAuth();
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
  await requireAuth();
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

export async function deleteSubClient(subClientId: string, masterClientId: string) {
  await requireAuth();
  await prisma.subClient.delete({ where: { id: subClientId } });

  revalidatePath(`/clientes/${masterClientId}`);
  revalidatePath("/clientes");
  revalidatePath("/");
}

export async function updateClient(clientId: string, formData: FormData) {
  await requireAuth();
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
  await requireAuth();
  await prisma.client.delete({ where: { id: clientId } });

  revalidatePath("/clientes");
  revalidatePath("/");
}

export async function createService(clientId: string, formData: FormData) {
  await requireAuth();
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

export async function updateService(
  serviceId: string,
  clientId: string,
  subClientId: string | undefined,
  formData: FormData
) {
  await requireAuth();

  const description = String(formData.get("description") ?? "").trim();
  if (!description) throw new Error("Descrição do serviço é obrigatória.");

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: { installments: true },
  });
  if (!service) throw new Error("Serviço não encontrado.");

  const hasPaidInstallments = service.installments.some((i) => i.paid);

  if (hasPaidInstallments) {
    await prisma.service.update({ where: { id: serviceId }, data: { description } });
  } else {
    const totalValue = Number(formData.get("totalValue"));
    const paymentType = String(formData.get("paymentType")) as PaymentType;
    const installmentsCountRaw = Number(formData.get("installmentsCount") ?? 1);
    const firstPaymentDate = parseDateInput(String(formData.get("firstPaymentDate")));

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

    await prisma.$transaction([
      prisma.installment.deleteMany({ where: { serviceId } }),
      prisma.service.update({
        where: { id: serviceId },
        data: {
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
      }),
    ]);
  }

  revalidatePath(`/clientes/${clientId}`);
  if (subClientId) {
    revalidatePath(`/clientes/${clientId}/subclientes/${subClientId}`);
  }
  revalidatePath("/");
}

export async function deleteService(serviceId: string, clientId: string, subClientId?: string) {
  await requireAuth();
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
  await requireAuth();
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

const MAX_RECEIPT_BYTES = 3 * 1024 * 1024;
const ALLOWED_RECEIPT_TYPES = ["image/png", "image/jpeg", "image/webp", "application/pdf"];

export async function attachReceipt(
  installmentId: string,
  clientId: string,
  subClientId: string | undefined,
  formData: FormData
) {
  await requireAuth();

  const file = formData.get("receipt");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Selecione um arquivo.");
  }
  if (file.size > MAX_RECEIPT_BYTES) {
    throw new Error("Arquivo muito grande (máximo 3MB).");
  }
  if (!ALLOWED_RECEIPT_TYPES.includes(file.type)) {
    throw new Error("Tipo de arquivo não suportado. Envie uma imagem ou PDF.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const data = buffer.toString("base64");

  await prisma.$transaction([
    prisma.receipt.upsert({
      where: { installmentId },
      update: { data },
      create: { installmentId, data },
    }),
    prisma.installment.update({
      where: { id: installmentId },
      data: { receiptFileName: file.name, receiptFileType: file.type },
    }),
  ]);

  revalidatePath(`/clientes/${clientId}`);
  if (subClientId) {
    revalidatePath(`/clientes/${clientId}/subclientes/${subClientId}`);
  }
}

export async function removeReceipt(
  installmentId: string,
  clientId: string,
  subClientId?: string
) {
  await requireAuth();

  await prisma.$transaction([
    prisma.receipt.deleteMany({ where: { installmentId } }),
    prisma.installment.update({
      where: { id: installmentId },
      data: { receiptFileName: null, receiptFileType: null },
    }),
  ]);

  revalidatePath(`/clientes/${clientId}`);
  if (subClientId) {
    revalidatePath(`/clientes/${clientId}/subclientes/${subClientId}`);
  }
}

function emptyToNull(value: FormDataEntryValue | null): string | null {
  const str = String(value ?? "").trim();
  return str.length > 0 ? str : null;
}
