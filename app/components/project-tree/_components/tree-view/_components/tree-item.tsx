import type { ReactNode } from "react";
import { ChevronRightIcon } from "lucide-react";
import { treeItemId } from "@/app/components/project-tree/lib/tree-nodes";
import type { ProjectTree, TreeNode } from "@/app/components/project-tree/types/tree";
import { cn } from "@/app/lib/utils";

const LEVEL_PADDING = { 1: "pl-1", 2: "pl-6", 3: "pl-11" } as const;

interface TreeItemProps {
  node: TreeNode;
  tree: ProjectTree;
  icon: ReactNode;
  label: string;
  description?: string;
  meta?: string | null;
  trailing?: ReactNode;
  children?: ReactNode;
}

export function TreeItem({ node, tree, icon, label, description, meta, trailing, children }: TreeItemProps) {
  const expandable = node.kind !== "task";
  const expanded = tree.isExpanded(node.key);

  return (
    <li
      role="treeitem"
      id={treeItemId(node.key)}
      aria-level={node.level}
      aria-expanded={expandable ? expanded : undefined}
      aria-selected={false}
      aria-label={node.kind === "task" ? `${label}, press Enter to log time` : label}
      tabIndex={node.key === tree.tabbableKey ? 0 : -1}
      onFocus={(event) => event.target === event.currentTarget && tree.setFocusedKey(node.key)}
      className="group/item outline-none"
    >
      <div
        onClick={() => tree.activate(node)}
        className={cn(
          "flex min-h-9 cursor-pointer items-center gap-2 rounded-md py-1 pr-1.5 text-sm hover:bg-muted group-focus-visible/item:ring-2 group-focus-visible/item:ring-ring/60",
          LEVEL_PADDING[node.level],
        )}
      >
        {expandable ? (
          <ChevronRightIcon
            className={cn("size-4 shrink-0 text-muted-foreground transition-transform", expanded && "rotate-90")}
            aria-hidden
          />
        ) : (
          <span className="size-4 shrink-0" aria-hidden />
        )}
        <span className="shrink-0 text-muted-foreground [&_svg]:size-4" aria-hidden>
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline gap-2">
            <span className="truncate font-medium" title={label}>
              {label}
            </span>
            {meta && <span className="shrink-0 text-xs text-muted-foreground">{meta}</span>}
          </span>
          {description && <span className="block truncate text-xs text-muted-foreground">{description}</span>}
        </span>
        <span className="flex shrink-0 items-center gap-1.5">{trailing}</span>
      </div>
      {expandable && expanded && <ul role="group">{children}</ul>}
    </li>
  );
}
