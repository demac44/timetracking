"use client";

import { useMemo, useState } from "react";
import { useProjectTree } from "@/app/components/project-tree/hooks/use-project-tree";
import { handleTreeKeyDown } from "@/app/components/project-tree/lib/tree-keyboard";
import { filterClientsByName } from "@/app/components/project-tree/lib/tree-nodes";
import type { Client } from "@/app/types/client";
import { ClientFilter } from "./_components/client-filter";
import { ClientNode } from "./_components/client-node";
import { NoMatchingClients } from "./_components/no-matching-clients";

export function TreeView({ clients }: { clients: Client[] }) {
  const [query, setQuery] = useState("");
  const visibleClients = useMemo(() => filterClientsByName(clients, query), [clients, query]);
  const tree = useProjectTree(visibleClients);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ClientFilter query={query} count={visibleClients.length} onQueryChange={setQuery} />

      {visibleClients.length === 0 ? (
        <NoMatchingClients query={query} onClear={() => setQuery("")} />
      ) : (
        <ul
          role="tree"
          aria-label="Clients, projects and tasks"
          className="min-h-0 flex-1 overflow-y-auto p-2"
          onKeyDown={(event) => handleTreeKeyDown(event, tree)}
        >
          {visibleClients.map((client) => (
            <ClientNode key={client.id} client={client} tree={tree} />
          ))}
        </ul>
      )}
    </div>
  );
}
