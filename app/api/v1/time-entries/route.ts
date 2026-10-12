import type { NextRequest } from "next/server";
import { getPaginationParams, parseJsonBody, toErrorResponse } from "@/app/lib/api/route-utils";
import { createTimeEntry, getTimeEntries } from "@/app/services/time-entries";
import type { TimeEntryInput } from "@/app/types/time-entry";

export async function GET(request: NextRequest) {
  try {
    const timeEntries = await getTimeEntries(getPaginationParams(request.nextUrl.searchParams));
    return Response.json(timeEntries);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const input = await parseJsonBody<TimeEntryInput>(request);
    const timeEntry = await createTimeEntry(input);
    return Response.json(timeEntry, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
