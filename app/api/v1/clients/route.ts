import type { NextRequest } from "next/server";
import { getPaginationParams, toErrorResponse } from "@/app/lib/api/route-utils";
import { getClients } from "@/app/services/clients";

export async function GET(request: NextRequest) {
  try {
    const clients = await getClients(getPaginationParams(request.nextUrl.searchParams));
    return Response.json(clients);
  } catch (error) {
    return toErrorResponse(error);
  }
}
