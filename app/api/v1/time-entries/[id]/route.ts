import type { NextRequest } from "next/server";
import { parseId, parseJsonBody, toErrorResponse } from "@/app/lib/api/route-utils";
import { deleteTimeEntry, getTimeEntry, updateTimeEntry } from "@/app/services/time-entries";
import type { TimeEntryInput } from "@/app/types/time-entry";

export async function GET(_request: NextRequest, ctx: RouteContext<"/api/v1/time-entries/[id]">) {
  try {
    const { id } = await ctx.params;
    const timeEntry = await getTimeEntry(parseId(id));
    return Response.json(timeEntry);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PUT(request: NextRequest, ctx: RouteContext<"/api/v1/time-entries/[id]">) {
  try {
    const { id } = await ctx.params;
    const input = await parseJsonBody<TimeEntryInput>(request);
    const timeEntry = await updateTimeEntry(parseId(id), input);
    return Response.json(timeEntry);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(_request: NextRequest, ctx: RouteContext<"/api/v1/time-entries/[id]">) {
  try {
    const { id } = await ctx.params;
    const result = await deleteTimeEntry(parseId(id));
    return Response.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}
