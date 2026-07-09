import type { WorkspacePrimitiveComponent } from "./shared";
import { Panel } from "./shared";

export const Composer: WorkspacePrimitiveComponent = () => (
  <Panel title="Composer" caption="Composer">
    <form className="workspace-composer">
      <textarea rows={5} placeholder="Write a reply, draft, or note..." />
      <div className="workspace-composer__actions">
        <span className="workspace-muted">Responses are added to the workspace thread.</span>
        <button type="button" className="workspace-button workspace-button--primary">
          Send
        </button>
      </div>
    </form>
  </Panel>
);
