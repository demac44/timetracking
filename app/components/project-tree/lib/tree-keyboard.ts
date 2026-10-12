import type { KeyboardEvent } from "react";
import type { ProjectTree, TreeNode } from "@/app/components/project-tree/types/tree";
import { treeItemId } from "./tree-nodes";

function focusNode(tree: ProjectTree, node: TreeNode | undefined) {
  if (node) {
    tree.setFocusedKey(node.key);
    document.getElementById(treeItemId(node.key))?.focus();
  }
}

export function handleTreeKeyDown(event: KeyboardEvent<HTMLUListElement>, tree: ProjectTree) {
  const { nodes } = tree;
  const index = nodes.findIndex((node) => node.key === tree.tabbableKey);
  const node = nodes[index];

  if (!node) {
    return;
  }

  switch (event.key) {
    case "ArrowDown":
      focusNode(tree, nodes[index + 1]);
      break;
    case "ArrowUp":
      focusNode(tree, nodes[index - 1]);
      break;
    case "Home":
      focusNode(tree, nodes[0]);
      break;
    case "End":
      focusNode(tree, nodes.at(-1));
      break;
    case "ArrowRight":
      if (node.kind !== "task" && !tree.isExpanded(node.key)) {
        tree.toggle(node);
      } else if (nodes[index + 1]?.level > node.level) {
        focusNode(tree, nodes[index + 1]);
      }
      break;
    case "ArrowLeft":
      if (node.kind !== "task" && tree.isExpanded(node.key)) {
        tree.toggle(node);
      } else {
        focusNode(
          tree,
          nodes.slice(0, index).findLast((candidate) => candidate.level < node.level),
        );
      }
      break;
    case "Enter":
    case " ":
      tree.activate(node);
      break;
    default:
      return;
  }

  event.preventDefault();
}
