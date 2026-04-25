# Canvas LMS Repository Navigation Guide

This guide helps AI agents quickly find where to read, edit, and validate changes in this repository.

## High-Level Architecture

- **Backend framework:** Ruby on Rails
- **Frontend stack:** React/TypeScript plus shared UI packages
- **Monorepo style:** Rails app plus UI/packages/plugins in one repository
- **Key domain concerns:** multi-tenancy (accounts), sharding (Switchman), LTI integrations, plugin extensions

## Top-Level Directory Map

### Core Product Code

- `app/` - Main Rails MVC code
  - `app/controllers/` request handling and API/controller logic
  - `app/models/` ActiveRecord models and business data behaviors
  - `app/views/` Rails-rendered views/templates
- `lib/` - Shared Ruby services, support modules, and domain logic

### Frontend and Shared JS/TS

- `ui/` - React components and frontend platform code
- `packages/` - Shared npm packages and reusable frontend utilities

### Extension System

- `gems/plugins/` - Canvas plugin implementations (feature-specific extensions)

### Documentation and Agent Support

- `doc/` - Product and engineering docs (including testing docs)
- `agents/` - Agent-facing notes and repository analysis docs

## Where to Edit for Common Tasks

### Backend Feature or Bug Fix (Rails)

1. Start with controller/model entry points in `app/controllers/` and `app/models/`.
2. Follow related domain logic into `lib/` when behavior spans multiple models.
3. If UI rendering is server-side, check `app/views/`.

### Frontend Feature or Bug Fix (React/TS)

1. Locate feature components in `ui/`.
2. Check shared logic/components in `packages/` before duplicating code.
3. Confirm any API contract assumptions against backend controllers/serializers.

### Plugin-Specific Work

1. Search `gems/plugins/` for the owning plugin.
2. Keep plugin changes isolated unless a shared interface must be updated.

### Cross-Cutting Integrations (LTI, Tenancy, Sharding)

1. Identify account hierarchy and tenant assumptions first.
2. Review shard-aware logic where data access crosses account boundaries.
3. Trace integration points in both Rails and UI layers before editing.

## Fast Search Heuristics

- Start by symbol or endpoint name:
  - controllers/models: `rg "ClassName|method_name|endpoint_name" app lib`
  - frontend components/hooks: `rg "ComponentName|hookName|propName" ui packages`
  - plugins: `rg "feature_or_plugin_keyword" gems/plugins`
- Prefer narrowing by directory once an entry point is found to avoid noisy global searches.

## Validation and Quality Checks

Run commands in the web container when required by local setup:

- Build (all): `yarn build`
- Frontend dev/watch: `yarn build:watch`
- JS tests: `yarn test` or `yarn test path/to/test`
- Ruby tests: `bin/rspec` or `bin/rspec path/to/spec.rb`
- Type checks: `yarn check:ts`
- JS lint: `yarn lint`
- Ruby lint: `bin/rubocop`

## Agent Workflow Recommendations

1. **Map first, edit second:** identify the smallest owning module before changing code.
2. **Respect layer boundaries:** avoid mixing plugin logic into core modules unless necessary.
3. **Keep scope tight:** edit only the files needed for the behavior change.
4. **Validate close to change:** run targeted tests/lint first, broader checks second.
5. **Document assumptions:** when tenancy/sharding/LTI behavior is relevant, note it in PR context.

## Token Budgeting for Agents

Use tokens intentionally. Spend most of them on understanding the exact execution path and risk points, not on broad repository reads.

### What to Spend Tokens On

- **Ownership discovery (high priority):** find the true owner of the behavior first (core Rails, UI package, shared package, or plugin).
- **Execution-path tracing:** follow flow from entry point to implementation and tests (controller/component -> service/model/hook -> spec/test).
- **Risk-heavy logic:** multi-tenancy boundaries, sharding behavior, auth/permissions, grading or data integrity rules, and integration contracts (LTI/API/plugin boundaries).
- **Change-adjacent tests:** read and update the closest existing tests before writing net-new broad coverage.

### What to Minimize

- **Whole-repo or whole-directory reading** before an entry point is identified.
- **Large file scans end-to-end** when only one method/component path is relevant.
- **Unbounded searches** that return many noisy matches.
- **Speculative refactors** outside the requested behavior change.

### Practical Token Strategy

1. **Start narrow:** search by endpoint, class, component, or error string.
2. **Read local context first:** only the nearby methods/components and immediate call sites.
3. **Expand one hop at a time:** move outward only when a dependency is confirmed relevant.
4. **Stop when confidence is sufficient:** once behavior, owner, and validation path are clear, edit.
5. **Validate proportionally:** run targeted tests/lint first, then broaden only if impact is wider.

### Default Effort Split (Guideline)

- **40%** locating the correct owner and execution path
- **30%** understanding constraints and risk points
- **20%** implementing focused edits
- **10%** validation and follow-up checks

Adjust this split when the task is mostly mechanical (shift more to implementation) or high-risk (shift more to analysis and validation).