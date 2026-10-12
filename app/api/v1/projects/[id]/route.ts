import type { NextRequest } from "next/server";
import { parseId, toErrorResponse } from "@/app/lib/api/route-utils";
import { getProject } from "@/app/services/projects";

export async function GET(_request: NextRequest, ctx: RouteContext<"/api/v1/projects/[id]">) {
  try {
    const { id } = await ctx.params;
    const project = await getProject(parseId(id));
    return Response.json(project);
  } catch (error) {
    return toErrorResponse(error);
  }
}
