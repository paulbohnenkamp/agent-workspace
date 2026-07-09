import fs from "fs";
import os from "os";
import path from "path";

import { createDefaultComponentRegistry } from "../../../src/ComponentRegistry";
import { loadView } from "../../../src/view-loader";

describe("workspace view component aliases", () => {
  const projectRoot = path.join(process.cwd(), "docs/examples/hiring-project");

  it("loads the example views with the canonical aliases", () => {
    expect(() => loadView(projectRoot, "candidate-review")).not.toThrow();
    expect(() => loadView(projectRoot, "candidate-review", "react")).not.toThrow();
    expect(() => loadView(projectRoot, "open-roles-board")).not.toThrow();
    expect(() => loadView(projectRoot, "approval-queue")).not.toThrow();
  });

  it("exposes the expanded primitive catalog", () => {
    const registry = createDefaultComponentRegistry();

    expect(registry.has("badge")).toBe(true);
    expect(registry.has("panel")).toBe(true);
    expect(registry.has("list")).toBe(true);
    expect(registry.has("document")).toBe(true);
    expect(registry.has("header")).toBe(true);
    expect(registry.has("queue")).toBe(true);
    expect(registry.has("summaryCard")).toBe(true);
    expect(registry.has("timeline")).toBe(true);
    expect(registry.has("composer")).toBe(true);
    expect(registry.has("tabs")).toBe(true);
    expect(registry.has("sources")).toBe(true);
    expect(registry.has("statusList")).toBe(true);
    expect(registry.has("actions")).toBe(true);
  });

  it("loads a view that uses the generic primitives", () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "awp-view-primitives-"));
    const viewDir = path.join(tempRoot, "views", "primitive-aliases");

    fs.mkdirSync(viewDir, { recursive: true });
    fs.writeFileSync(
      path.join(viewDir, "view.json"),
      JSON.stringify(
        {
          id: "primitive-aliases",
          title: "Primitive Aliases",
          route: "/primitives",
          layout: {
            type: "grid",
            columns: ["minmax(0, 1fr)"],
            regions: [{ id: "main", columnStart: 1, columnSpan: 1 }],
          },
          regions: {
            main: [
              { component: "badge", bind: { label: "Active" } },
              { component: "panel", bind: { body: "Panel body" } },
              { component: "list", bind: { items: [{ id: "1", title: "Item one", detail: "Detail" }] } },
              {
                component: "document",
                bind: {
                  title: "Doc",
                  body: "Document body",
                  sections: [{ title: "Section", body: "Section body" }],
                },
              },
            ],
          },
        },
        null,
        2,
      ),
    );

    expect(() => loadView(tempRoot, "primitive-aliases")).not.toThrow();
  });

  it("rejects unknown component aliases", () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "awp-view-alias-"));
    const viewDir = path.join(tempRoot, "views", "invalid-alias");

    fs.mkdirSync(viewDir, { recursive: true });
    fs.writeFileSync(
      path.join(viewDir, "view.json"),
      JSON.stringify(
        {
          id: "invalid-alias",
          title: "Invalid Alias",
          route: "/invalid",
          layout: {
            type: "grid",
            columns: ["minmax(0, 1fr)"],
            regions: [{ id: "main", columnStart: 1, columnSpan: 1 }],
          },
          regions: {
            main: [
              {
                component: "candidate.header",
              },
            ],
          },
        },
        null,
        2,
      ),
    );

    expect(() => loadView(tempRoot, "invalid-alias")).toThrow(/unknown component alias/i);
  });
});
