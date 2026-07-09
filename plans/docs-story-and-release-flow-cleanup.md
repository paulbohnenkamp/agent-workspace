# Docs Story and Release Flow Cleanup

## Goal

Reshape the repository documentation so it reads like a polished product story, keeps the root README concise, and adds a clear changelog/release entry point for public-facing updates.

## Related Roadmap Item

- `ROADMAP.md` tracker entry: Documentation story and release flow cleanup

## Context

- The root README should be a short entry point, not a full architecture manual.
- The repo already has strong architecture/docs depth, but the top-level narrative is still too scattered for someone evaluating the product.
- The user wants a `CHANGELOG.md` plus a releases-style landing page, closer to the Codex repo presentation.
- Example workspace docs and screenshots should support the story instead of competing with it.

## Scope

### In scope

- Shorten and reshape the root `README.md` into a product overview with one visual example
- Add `CHANGELOG.md`
- Add a release notes landing page or equivalent that the changelog can point to
- Reorganize docs entry points so they read as a guided story
- Update example docs so they match current code and visuals
- Remove or rewrite stale explanations that drift from the implementation

### Out of scope

- Architecture V3 changes
- Runtime feature changes
- Major UI redesign beyond documentation screenshots and example references
- A new release automation pipeline unless it is needed to support the docs structure

## Implementation Steps

1. Audit the current doc entry points, example docs, and any existing release references.
2. Define the desired information flow for a new reader: what they see first, second, and third.
3. Add `CHANGELOG.md` and a releases landing page that points to release notes and highlights.
4. Rewrite the root README to be short, visual, and product-oriented.
5. Update docs landing pages and example docs so the story matches actual workspace behavior.
6. Capture a real workspace screenshot for the README hero image if one is not already available.
7. Validate links, examples, and doc consistency; then update roadmap and plan tracking.

## Acceptance Criteria

- The root README is short and points outward instead of duplicating the docs.
- The repo has a changelog and a releases entry point.
- The docs read like a coherent product story for new readers.
- Example docs and screenshots match the actual current workspace behavior.
- Stale or misleading explanations are removed or rewritten.

## Verification

- `Unit tests:` N/A unless doc-linked examples require code changes
- `Integration tests:` `npm test`, `npm run lint`, and `npm run build:workspace` if docs changes touch example code or screenshots
- `Manual checks:` Open README, docs landing pages, example docs, and changelog/release links in a browser

## Status

- `planned`
- `in progress`
- `ready to verify`
- `done`

## Completion Notes

- What changed
- What was verified
- Any follow-up items

## Outcome Summary

- Short summary of the finished plan

## Tooling / Verification Notes

- Build tool:
- Expected verification command:
- Current blocker, if any:
