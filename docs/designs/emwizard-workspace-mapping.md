# Emwizard To Workspace Mapping

This document records the specific patterns borrowed from `emwizard` for the workspace UI runtime in this repository.

The goal is not to copy Oracle JET or Preact APIs. The goal is to reuse the structural patterns that make `emwizard` composable and metadata-driven.

## Borrowed Patterns

### 1. Registry Pattern

`emwizard`
- `FieldRegistry`
- field type id -> registered component

Workspace runtime
- `ComponentRegistry`
- component id from `view.json` -> registered React renderer
- component implementations live one per file under `src/components/`

Shared idea:
- metadata names the thing
- registry resolves the implementation
- the renderer stays generic

Workspace canonical aliases:
- `shell`
- `rail`
- `canvas`
- `section`
- `stack`
- `grid`
- `toolbar`
- `badge`
- `panel`
- `card`
- `list`
- `document`
- `text`
- `divider`
- `header`
- `queue`
- `summaryCard`
- `timeline`
- `composer`
- `tabs`
- `sources`
- `statusList`
- `actions`

## 2. Layout Builder Pattern

`emwizard`
- layout builder factory
- layout builders for grid/container/flex/form composition

Workspace runtime
- layout builder factory
- layout builders for workspace, board, and master-detail composition

Shared idea:
- metadata declares layout
- builder interprets layout
- components do not own page placement

## 3. Generic Container / Shell

`emwizard`
- generic wizard container
- steps rendered inside a shared frame

Workspace runtime
- generic workspace shell
- regions rendered inside a shared frame

Shared idea:
- one container owns navigation, frame, and consistent chrome
- inner content changes by metadata, not by hand-authored page templates

## 4. Metadata Owns Structure

`emwizard`
- config declares fields, actions, layout, steps

Workspace runtime
- `view.json` declares regions or panels, layout, shell hints, and binding

Shared idea:
- runtime interprets metadata
- runtime should not invent view-specific structure in code

## 5. Typed Runtime Contracts

`emwizard`
- strongly typed wizard config and layout interfaces

Workspace runtime
- strongly typed view, layout, region, node, and binding interfaces

Shared idea:
- schema/types describe the valid shape
- renderers consume typed inputs rather than loose view-specific assumptions

## Deliberate Differences

The workspace runtime intentionally differs from `emwizard` in these ways:

1. React instead of Preact / Oracle JET
2. Functional React components instead of new class-based React components
3. Workspace regions instead of wizard steps
4. View nodes instead of field nodes

These are implementation differences, not architecture differences.

## Working Rule

When choosing between:
- inventing a new workspace runtime concept, or
- adapting an existing `emwizard` structural pattern

prefer adapting the `emwizard` pattern unless the workspace model truly needs a new concept.
