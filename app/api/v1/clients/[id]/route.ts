import type { NextRequest } from "next/server";
import { parseId, toErrorResponse } from "@/app/lib/api/route-utils";
import { getClient } from "@/app/services/clients";

export async function GET(_request: NextRequest, ctx: RouteContext<"/api/v1/clients/[id]">) {
  try {
    const { id } = await ctx.params;
    const client = await getClient(parseId(id));
    return Response.json(client);
  } catch (error) {
    return toErrorResponse(error);
  }
}
