import type { WorkspacePrimitiveComponent } from "./shared";
import { asArray, asBulletText, asRecord, asString } from "./shared";

export const DocumentPrimitive: WorkspacePrimitiveComponent = ({ node }) => {
  const bind = asRecord(node.bind);
  const sections = asArray(bind.sections);
  const body = asString(bind.body ?? bind.content ?? bind.summary);
  const title = node.title ?? asString(bind.title, "Document");

  return (
    <section className="workspace-document">
      <header className="workspace-document__header">
        <div>
          <p className="workspace-document__eyebrow">Document</p>
          <h2 className="workspace-document__section-title">{title}</h2>
        </div>
      </header>
      <div className="workspace-document__sections">
        {body ? <p>{body}</p> : null}
        {sections.map((section, index) => {
          const entry = asRecord(section);
          const bullets = asArray(entry.bullets);

          return (
            <article className="workspace-document__section" key={`${asString(entry.title, `section-${index}`)}-${index}`}>
              <h3>{asString(entry.title, "Section")}</h3>
              {entry.body ? <p>{asString(entry.body)}</p> : null}
              {bullets.length > 0 ? (
                <ul>
                  {bullets.map((bullet, bulletIndex) => (
                    <li key={`${bulletIndex}-${asBulletText(bullet)}`}>{asBulletText(bullet)}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
};
