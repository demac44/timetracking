"use client";

import type { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";

interface WorkspaceShellProps {
  header: ReactNode;
  sidebar: ReactNode;
  main: ReactNode;
}

export function WorkspaceShell({ header, sidebar, main }: WorkspaceShellProps) {
  return (
    <div className="flex min-h-dvh flex-col lg:h-dvh">
      {header}
      <Tabs defaultValue="entries" className="flex-1 gap-0 lg:grid lg:min-h-0 lg:grid-cols-[22rem_minmax(0,1fr)]">
        <div className="border-b px-4 py-2 lg:hidden">
          <TabsList className="w-full">
            <TabsTrigger value="entries">Time entries</TabsTrigger>
            <TabsTrigger value="projects">Clients & projects</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent
          value="projects"
          forceMount
          className="flex-col data-[state=active]:flex data-[state=inactive]:hidden lg:flex lg:min-h-0 lg:border-r lg:data-[state=inactive]:flex"
        >
          <aside aria-label="Clients and projects" className="flex min-h-0 flex-1 flex-col">
            {sidebar}
          </aside>
        </TabsContent>
        <TabsContent
          value="entries"
          forceMount
          className="relative data-[state=inactive]:hidden lg:min-h-0 lg:overflow-y-auto lg:data-[state=inactive]:block"
        >
          <main className="mx-auto flex w-full max-w-6xl flex-col gap-5 p-4 lg:p-6">{main}</main>
        </TabsContent>
      </Tabs>
    </div>
  );
}
