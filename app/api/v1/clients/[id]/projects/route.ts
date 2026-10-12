import type { NextRequest } from "next/server";
import { getPaginationParams, parseId, toErrorResponse } from "@/app/lib/api/route-utils";
import { getClientProjects } from "@/app/services/clients";

export async function GET(request: NextRequest, ctx: RouteContext<"/api/v1/clients/[id]/projects">) {
  try {
    const { id } = await ctx.params;
    const projects = await getClientProjects(parseId(id), getPaginationParams(request.nextUrl.searchParams));
    return Response.json(projects);
  } catch (error) {
    return toErrorResponse(error);
  }
}
