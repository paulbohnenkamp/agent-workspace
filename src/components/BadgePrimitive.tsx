import type { WorkspacePrimitiveComponent } from "./shared";
import { asRecord, asString, Badge } from "./shared";

export const BadgePrimitive: WorkspacePrimitiveComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const label = asString(bind.label ?? node.title ?? bind.status ?? "Badge");

  return <Badge label={label} />;
};
