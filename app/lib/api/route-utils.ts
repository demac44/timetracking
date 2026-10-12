import type { PaginationParams, SortOrder } from "@/app/types/api";
import { ApiError } from "./errors";

function isSortOrder(value: string): value is SortOrder {
  return value === "asc" || value === "desc";
}

function parseNonNegativeInteger(name: string, value: string | null) {
  if (value === null) {
    return undefined;
  }

  if (!/^\d+$/.test(value)) {
    throw new ApiError(400, `Invalid ${name}`);
  }

  return Number(value);
}

export function parseId(value: string) {
  const id = parseNonNegativeInteger("id", value);

  if (!id) {
    throw new ApiError(400, "Invalid id");
  }

  return id;
}

export function getPaginationParams<T>(searchParams: URLSearchParams): PaginationParams<T> {
  const sortBy = searchParams.get("sortBy");
  const order = searchParams.get("order");

  if (order !== null && !isSortOrder(order)) {
    throw new ApiError(400, "Invalid order");
  }

  return {
    limit: parseNonNegativeInteger("limit", searchParams.get("limit")),
    offset: parseNonNegativeInteger("offset", searchParams.get("offset")),
    sortBy: sortBy ? (sortBy as keyof T) : undefined,
    order: order ?? undefined,
  };
}

export async function parseJsonBody<T>(request: Request): Promise<T> {
  try {
    return await request.json();
  } catch {
    throw new ApiError(400, "Invalid JSON body");
  }
}

export function toErrorResponse(error: unknown) {
  if (error instanceof ApiError) {
    return Response.json({ error: error.message }, { status: error.status });
  }

  console.error(error);

  return Response.json({ error: "Internal server error" }, { status: 500 });
}
