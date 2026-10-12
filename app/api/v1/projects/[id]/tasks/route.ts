import type { NextRequest } from "next/server";
import { getPaginationParams, parseId, toErrorResponse } from "@/app/lib/api/route-utils";
import { getProjectTasks } from "@/app/services/projects";

export async function GET(request: NextRequest, ctx: RouteContext<"/api/v1/projects/[id]/tasks">) {
  try {
    const { id } = await ctx.params;
    const tasks = await getProjectTasks(parseId(id), getPaginationParams(request.nextUrl.searchParams));
    return Response.json(tasks);
  } catch (error) {
    return toErrorResponse(error);
  }
}
