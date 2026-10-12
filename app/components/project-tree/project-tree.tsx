import { connection } from "next/server";
import { PaneError } from "@/app/components/shared/pane-error";
import { getAllClients } from "@/app/services/cached";
import { TreeView } from "./_components/tree-view/tree-view";

export async function ProjectTree() {
  await connection();
  const result = await getAllClients();

  if (!result.ok) {
    return (
      <PaneError title="Couldn't load clients" status={result.status} message={result.message} retryAt={result.retryAt} />
    );
  }

  return <TreeView clients={result.data} />;
}
