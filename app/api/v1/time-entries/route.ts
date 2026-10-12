import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { getListParams, parseJsonBody, toErrorResponse } from "@/app/lib/api/route-utils";
import { unwrap } from "@/app/lib/api/result";
import { getTimeEntriesList } from "@/app/services/cached";
import { createTimeEntry } from "@/app/services/time-entries";
import { TIME_ENTRY_SORT_FIELDS, type TimeEntryInput } from "@/app/types/time-entry";

export async function GET(request: NextRequest) {
  try {
    const { limit, offset, sortBy, order } = getListParams(request.nextUrl.searchParams, TIME_ENTRY_SORT_FIELDS, {
      sortBy: "start",
      order: "desc",
    });
    return Response.json(unwrap(await getTimeEntriesList(limit, offset, sortBy, order)));
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const input = await parseJsonBody<TimeEntryInput>(request);
    const timeEntry = await createTimeEntry(input);
    revalidateTag("time-entries", { expire: 0 });
    return Response.json(timeEntry, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
