import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { id } = await params;
  const installment = await prisma.installment.findUnique({
    where: { id },
    include: { receipt: true },
  });

  if (!installment?.receipt) {
    return NextResponse.json({ error: "Comprovante não encontrado." }, { status: 404 });
  }

  const buffer = Buffer.from(installment.receipt.data, "base64");
  const contentType = installment.receiptFileType ?? "application/octet-stream";
  const fileName = installment.receiptFileName ?? "comprovante";
  const isPreviewable = contentType.startsWith("image/") || contentType === "application/pdf";

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `${isPreviewable ? "inline" : "attachment"}; filename="${fileName}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
