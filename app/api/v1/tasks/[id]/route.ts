import type { NextRequest } from "next/server";
import { parseId, toErrorResponse } from "@/app/lib/api/route-utils";
import { getTask } from "@/app/services/tasks";

export async function GET(_request: NextRequest, ctx: RouteContext<"/api/v1/tasks/[id]">) {
  try {
    const { id } = await ctx.params;
    const task = await getTask(parseId(id));
    return Response.json(task);
  } catch (error) {
    return toErrorResponse(error);
  }
}
