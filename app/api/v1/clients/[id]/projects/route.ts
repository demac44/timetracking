import type { NextRequest } from "next/server";
import { parseId, toErrorResponse } from "@/app/lib/api/route-utils";
import { unwrap } from "@/app/lib/api/result";
import { getAllClientProjects } from "@/app/services/cached";

export async function GET(_request: NextRequest, ctx: RouteContext<"/api/v1/clients/[id]/projects">) {
  try {
    const { id } = await ctx.params;
    return Response.json(unwrap(await getAllClientProjects(parseId(id))));
  } catch (error) {
    return toErrorResponse(error);
  }
}
