import type { WorkspacePrimitiveComponent } from "./shared";
import { asRecord, asString } from "./shared";

export const DividerPrimitive: WorkspacePrimitiveComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const label = asString(bind.label ?? node.title);

  return (
    <div className="workspace-divider-wrap">
      {label ? <span className="workspace-divider-label">{label}</span> : null}
      <hr className="workspace-divider" />
    </div>
  );
};
