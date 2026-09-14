import { NextResponse } from "next/server";
import { getSubClientNames } from "@/lib/queries";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const subClients = await getSubClientNames(id);
  return NextResponse.json(subClients);
}
