import { NextRequest, NextResponse } from "next/server";
import { searchClients } from "@/lib/queries";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const results = await searchClients(q);
  return NextResponse.json(results);
}
