import { connection } from "next/server";
import { toErrorResponse } from "@/app/lib/api/route-utils";
import { unwrap } from "@/app/lib/api/result";
import { getAllClients } from "@/app/services/cached";

export async function GET() {
  try {
    await connection();
    return Response.json(unwrap(await getAllClients()));
  } catch (error) {
    return toErrorResponse(error);
  }
}
