"use client";

import { useSearchParams } from "next/navigation";
import type { DrawerTarget } from "@/app/components/entry-drawer/types/drawer-target";

const DIGITS = /^\d+$/;

export function useEntryDrawerTarget(): DrawerTarget | null {
  const params = useSearchParams();
  const entry = params.get("entry");
  const taskId = params.get("taskId");

  if (entry === "new") {
    return { mode: "new", taskId: taskId && DIGITS.test(taskId) ? Number(taskId) : null };
  }

  if (entry && DIGITS.test(entry)) {
    return { mode: "edit", id: Number(entry) };
  }

  return null;
}
