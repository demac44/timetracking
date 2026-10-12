"use client";

import { useEffect, useState } from "react";
import { getCachedTaskPath, resolveTaskPath } from "@/app/components/time-entry-form/lib/task-paths";
import type { TaskPath, TaskPathStatus } from "@/app/components/time-entry-form/types/task-path";

type ResolvedTaskPath = { taskId: number; status: "ready"; path: TaskPath } | { taskId: number; status: "failed" };

export function useTaskPath(taskId: number | null): { path: TaskPath | null; status: TaskPathStatus } {
  const [resolved, setResolved] = useState<ResolvedTaskPath | null>(null);
  const cached = taskId === null ? null : getCachedTaskPath(taskId);

  useEffect(() => {
    if (taskId === null || cached) {
      return;
    }

    let cancelled = false;

    resolveTaskPath(taskId).then(
      (path) => !cancelled && setResolved({ taskId, status: "ready", path }),
      () => !cancelled && setResolved({ taskId, status: "failed" }),
    );

    return () => {
      cancelled = true;
    };
  }, [taskId, cached]);

  if (taskId === null) {
    return { path: null, status: "idle" };
  }

  if (cached) {
    return { path: cached, status: "ready" };
  }

  if (resolved?.taskId === taskId) {
    return resolved.status === "ready" ? { path: resolved.path, status: "ready" } : { path: null, status: "failed" };
  }

  return { path: null, status: "loading" };
}
