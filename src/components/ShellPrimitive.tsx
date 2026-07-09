import type { WorkspacePrimitiveComponent } from "./shared";
import { asRecord, asString, Badge, renderListItems, pickArray } from "./shared";

export const ShellPrimitive: WorkspacePrimitiveComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const body = asString(bind.body ?? bind.content ?? bind.summary);
  const items = pickArray(bind, ["items", "sections", "entries"]);
  const status = asString(bind.status ?? bind.state);

  return (
    <section className="workspace-shell-surface">
      <header className="workspace-shell-surface__header">
        <div>
          <p className="workspace-shell-surface__eyebrow">Shell</p>
          <h2 className="workspace-shell-surface__title">{asString(node.title ?? bind.title, "Shell")}</h2>
          {asString(bind.caption ?? bind.subtitle) ? (
            <p className="workspace-shell-surface__caption">{asString(bind.caption ?? bind.subtitle)}</p>
          ) : null}
        </div>
        {status ? <Badge label={status} /> : null}
      </header>
      {body ? <p className="workspace-shell-surface__body">{body}</p> : null}
      {items.length > 0 ? <div className="workspace-stack">{renderListItems(items, "No shell items.")}</div> : null}
    </section>
  );
};
