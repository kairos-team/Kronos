import { addMonths } from "date-fns";
import type { PaymentType } from "@/generated/prisma/enums";

export type GeneratedInstallment = {
  number: number;
  dueDate: Date;
  value: number;
};

export function generateInstallments(
  totalValue: number,
  paymentType: PaymentType,
  installmentsCount: number,
  firstPaymentDate: Date
): GeneratedInstallment[] {
  if (paymentType === "UNICO") {
    return [{ number: 1, dueDate: firstPaymentDate, value: totalValue }];
  }

  const count = Math.max(1, installmentsCount);
  const rawValue = Math.floor((totalValue / count) * 100) / 100;
  const installments: GeneratedInstallment[] = [];
  let allocated = 0;

  for (let i = 0; i < count; i++) {
    const isLast = i === count - 1;
    const value = isLast ? Math.round((totalValue - allocated) * 100) / 100 : rawValue;
    allocated += value;
    installments.push({
      number: i + 1,
      dueDate: addMonths(firstPaymentDate, i),
      value,
    });
  }

  return installments;
}

export type InstallmentStatus = "PAGO" | "ATRASADO" | "PENDENTE";

export function getInstallmentStatus(installment: {
  paid: boolean;
  dueDate: Date;
}): InstallmentStatus {
  if (installment.paid) return "PAGO";
  if (installment.dueDate.getTime() < startOfToday().getTime()) return "ATRASADO";
  return "PENDENTE";
}

/**
 * Due dates are stored as UTC midnight of the calendar date the user picked
 * (see parseDateInput in actions.ts). "Today" must be computed the same way —
 * using UTC-midnight of the current local calendar day — otherwise comparisons
 * drift by the server's timezone offset (e.g. an installment due on the 1st
 * gets counted in the previous month for any UTC-negative timezone).
 */
export function startOfToday(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

export function startOfUTCMonth(monthOffset: number): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth() + monthOffset, 1));
}
