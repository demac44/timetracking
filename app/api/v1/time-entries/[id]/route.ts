import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { parseId, parseJsonBody, toErrorResponse } from "@/app/lib/api/route-utils";
import { unwrap } from "@/app/lib/api/result";
import { getTimeEntryById } from "@/app/services/cached";
import { deleteTimeEntry, updateTimeEntry } from "@/app/services/time-entries";
import type { TimeEntryInput } from "@/app/types/time-entry";

function invalidate(id: number) {
  revalidateTag("time-entries", { expire: 0 });
  revalidateTag(`time-entry:${id}`, { expire: 0 });
}

export async function GET(_request: NextRequest, ctx: RouteContext<"/api/v1/time-entries/[id]">) {
  try {
    const { id } = await ctx.params;
    return Response.json(unwrap(await getTimeEntryById(parseId(id))));
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PUT(request: NextRequest, ctx: RouteContext<"/api/v1/time-entries/[id]">) {
  try {
    const id = parseId((await ctx.params).id);
    const input = await parseJsonBody<TimeEntryInput>(request);
    const timeEntry = await updateTimeEntry(id, input);
    invalidate(id);
    return Response.json(timeEntry);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(_request: NextRequest, ctx: RouteContext<"/api/v1/time-entries/[id]">) {
  try {
    const id = parseId((await ctx.params).id);
    const result = await deleteTimeEntry(id);
    invalidate(id);
    return Response.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}
