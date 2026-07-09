import { hiringProjectState } from "./data/hiring-project-state";
import { interpretView } from "./interpreter";
import { renderWorkspace } from "./render-workspace";
import { loadView } from "./view-loader";
import type { WorkspaceNavigationItem } from "../packages/types/src/workspace";

const navigation: WorkspaceNavigationItem[] = [
  {
    id: "open-roles-board",
    label: "Open Roles Board",
    href: "/hiring/open-roles-board",
  },
  {
    id: "candidate-review",
    label: "Candidate Review",
    href: "/hiring/candidate-review?candidateId=avery-chen",
  },
  {
    id: "approval-queue",
    label: "Approval Queue",
    href: "/hiring/approval-queue",
  },
];

const projectRoot = "./docs/examples/hiring-project";

function assertRendered(viewId: string, route: Record<string, string>, expectedText: string[]): void {
  const view = loadView(projectRoot, viewId, "react");
  const html = renderWorkspace(interpretView(view, hiringProjectState, route), navigation);

  expectedText.forEach((text) => {
    if (!html.includes(text)) {
      throw new Error(`Expected "${text}" in rendered HTML for ${viewId}`);
    }
  });
}

assertRendered("candidate-review", { candidateId: "avery-chen" }, [
  "Candidate Review",
  "Avery Chen",
  "Senior Product Designer",
  "Evaluation Summary",
  "Knowledge Sources",
  "AI Assistant",
]);

assertRendered("open-roles-board", {}, [
  "Open Roles Board",
  "Avery Chen",
  "Priya Shah",
  "Sara Johnson",
  "Marcus Williams",
  "In Review",
  "Approved",
]);

assertRendered("approval-queue", {}, [
  "Approval Queue",
  "Avery Chen",
  "Priya Shah",
  "Pending Approvals",
  "Latest Events",
  "Selected Artifact",
]);

console.log("workspace render smoke passed");
