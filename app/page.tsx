import { Suspense } from "react";
import { EntryDrawer } from "@/app/components/entry-drawer/entry-drawer";
import { SidebarHeader } from "@/app/components/project-tree/_components/sidebar-header";
import { TreeSkeleton } from "@/app/components/project-tree/_components/tree-skeleton";
import { ProjectTree } from "@/app/components/project-tree/project-tree";
import { PaneBoundary } from "@/app/components/shared/pane-boundary/pane-boundary";
import { EntriesHeader } from "@/app/components/time-entries/_components/entries-header";
import { EntriesSkeleton } from "@/app/components/time-entries/_components/entries-skeleton";
import { EntriesSection } from "@/app/components/time-entries/entries-section";
import { AppHeader } from "@/app/components/workspace-shell/_components/app-header";
import { WorkspaceShell } from "@/app/components/workspace-shell/workspace-shell";

export default function Page({ searchParams }: PageProps<"/">) {
  return (
    <>
      <WorkspaceShell
        header={<AppHeader />}
        sidebar={
          <>
            <SidebarHeader />
            <PaneBoundary title="Couldn't show clients">
              <Suspense fallback={<TreeSkeleton />}>
                <ProjectTree />
              </Suspense>
            </PaneBoundary>
          </>
        }
        main={
          <>
            <EntriesHeader />
            <PaneBoundary title="Couldn't show time entries">
              <Suspense fallback={<EntriesSkeleton />}>
                <EntriesSection searchParams={searchParams} />
              </Suspense>
            </PaneBoundary>
          </>
        }
      />
      <Suspense fallback={null}>
        <EntryDrawer />
      </Suspense>
    </>
  );
}
