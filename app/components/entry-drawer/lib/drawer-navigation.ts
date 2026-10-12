import type { DrawerTarget } from "@/app/components/entry-drawer/types/drawer-target";

function writeUrl(target: DrawerTarget | null, method: "pushState" | "replaceState") {
  const url = new URL(window.location.href);
  url.searchParams.delete("entry");
  url.searchParams.delete("taskId");

  if (target?.mode === "new") {
    url.searchParams.set("entry", "new");

    if (target.taskId !== null) {
      url.searchParams.set("taskId", String(target.taskId));
    }
  } else if (target?.mode === "edit") {
    url.searchParams.set("entry", String(target.id));
  }

  window.history[method](null, "", `${url.pathname}${url.search}`);
}

export function openEntryDrawer(target: DrawerTarget) {
  writeUrl(target, "pushState");
}

export function closeEntryDrawer() {
  writeUrl(null, "replaceState");
}

export function getTargetKey(target: DrawerTarget | null) {
  if (!target) {
    return "closed";
  }

  return target.mode === "edit" ? `edit-${target.id}` : `new-${target.taskId ?? ""}`;
}
