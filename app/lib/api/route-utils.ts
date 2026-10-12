import { unstable_rethrow } from "next/navigation";
import type { SortOrder } from "@/app/types/api";
import { ApiError } from "./errors";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

interface ListDefaults<S extends string> {
  sortBy: S;
  order: SortOrder;
}

function isSortOrder(value: string): value is SortOrder {
  return value === "asc" || value === "desc";
}

function isOneOf<S extends string>(values: readonly S[], value: string): value is S {
  return (values as readonly string[]).includes(value);
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

  if (id === undefined) {
    throw new ApiError(400, "Invalid id");
  }

  return id;
}

export function getListParams<S extends string>(
  searchParams: URLSearchParams,
  sortFields: readonly S[],
  defaults: ListDefaults<S>,
) {
  const sortBy = searchParams.get("sortBy") ?? defaults.sortBy;
  const order = searchParams.get("order") ?? defaults.order;
  const limit = parseNonNegativeInteger("limit", searchParams.get("limit")) ?? DEFAULT_LIMIT;

  if (!isOneOf(sortFields, sortBy)) {
    throw new ApiError(400, "Invalid sortBy");
  }

  if (!isSortOrder(order)) {
    throw new ApiError(400, "Invalid order");
  }

  if (limit < 1 || limit > MAX_LIMIT) {
    throw new ApiError(400, `limit must be between 1 and ${MAX_LIMIT}`);
  }

  return {
    limit,
    offset: parseNonNegativeInteger("offset", searchParams.get("offset")) ?? 0,
    sortBy,
    order,
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
  unstable_rethrow(error);

  if (error instanceof ApiError) {
    const headers = error.retryAt
      ? { "Retry-After": String(Math.max(1, Math.ceil((error.retryAt - Date.now()) / 1000))) }
      : undefined;

    return Response.json({ error: error.message, retryAt: error.retryAt }, { status: error.status, headers });
  }

  console.error(error);

  return Response.json({ error: "Internal server error" }, { status: 500 });
}
