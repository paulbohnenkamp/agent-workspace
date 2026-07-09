import type { WorkspacePrimitiveComponent } from "./shared";
import { asArray, asRecord, asString, asBulletText } from "./shared";

export const TextPrimitive: WorkspacePrimitiveComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const body = asString(bind.body ?? bind.content ?? bind.summary ?? bind.text);
  const items = asArray(bind.items ?? bind.bullets);

  return (
    <section className="workspace-text">
      {node.title ?? bind.title ? <h3 className="workspace-text__title">{asString(node.title ?? bind.title)}</h3> : null}
      {body ? <p>{body}</p> : <p className="workspace-muted">No text provided.</p>}
      {items.length > 0 ? <ul>{items.map((item, index) => <li key={`${index}-${asBulletText(item)}`}>{asBulletText(item)}</li>)}</ul> : null}
    </section>
  );
};
