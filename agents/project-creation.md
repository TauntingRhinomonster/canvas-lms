# Agent specification: GitHub project + issues (Feature 1 handoff)

Use this document as the **system / task prompt** for an LLM that has access to the **GitHub MCP** (or equivalent GitHub API tools). The goal is to create a **GitHub Project** for the fork below, then **create and link issues** derived from the Lab 4 / implementation handoff material, with **priorities** and **traceability** to repository evidence.

---

## 1) Target repository, owner, and branch

| Field | Value |
|--------|--------|
| **Owner** | `TauntingRhinomonster` |
| **Repository** | `canvas-lms` (full name: `TauntingRhinomonster/canvas-lms`) |
| **Default branch** | `master` (confirm with `git remote -v` / GitHub UI if your course fork uses `main` or a topic branch) |
| **Upstream (reference only)** | `instructure/canvas-lms` — do not open issues or projects on upstream unless the user explicitly says so |

**All project boards, issues, labels, and milestones must be created on the fork** `TauntingRhinomonster/canvas-lms`, not on `instructure/canvas-lms`.

If the user’s assignment names a different fork, branch, or owner, **replace the table above** with the user-provided values before executing any GitHub actions.

---

## 2) Source of user stories (Lab 4 handoff)

1. **Primary path (hyphenated):** `agents/tasks/feature-1/implementation-research.md`  
2. **Alternate path in this repo:** `agents/tasks/feature-1/implementationresearch.md`  

Read whichever file exists. Treat the handoff as the combined material used to build the board:

- **Functional requirements:** section **“## 2) Functional requirements”** (FR-1 … FR-8).
- **Non-functional requirements:** section **“## 3) Non-functional requirements”** (NFR-1 … NFR-6) — use for acceptance constraints, labels, or subtasks; merge into related FR issues where appropriate.
- **Codebase / change locations:** section **“## 4) Codebase analysis…”** (hypotheses, concrete findings, open questions).
- **Testing & verification:** section **“## 5) Testing and verification plan”** (unit tests, integration points, manual checks, acceptance criteria AC-1 … AC-6).

If a heading literally named **“Lab 4 handoff”** appears in the user’s copy, **prefer that subsection** for story text and acceptance criteria; otherwise use the sections above as the handoff.

---

## 3) Mandatory traceability to `agents/analyze-repo.md`

The implementation research explicitly names **`agents/analyze-repo.md`** as the repository analysis source (section 4). Every **epic, milestone, or user story issue** the agent creates must include a **“Traceability”** subsection in the issue body that satisfies **both**:

1. **Evidence from `agents/analyze-repo.md`:** Cite at least one concrete anchor, for example:
   - A section heading (e.g. **“Where to Edit for Common Tasks → Frontend Feature or Bug Fix (React/TS)”**, **“Agent Workflow Recommendations”**, **“Validation and Quality Checks”**), **or**
   - A quoted principle that applies to this work (e.g. locate ownership under `ui/` / `packages/`, validate with targeted `yarn test` / `yarn check:ts` as appropriate).

2. **Evidence from the handoff file:** Cite at least one **file path** or **symbol** from section 4’s hypotheses or findings (e.g. `ui/shared/planner/utilities/apiUtils.js`, `getDateBucketMoment`, `transformApiToInternalItem`) so the story is grounded in the researched implementation map.

**Milestone / epic linkage:** If the GitHub Project or repo uses **milestones**, set the milestone title to something like **`Feature 1: Better To-do List (Planner bucketing)`** and ensure each issue either belongs to that milestone or links to an epic issue that does.

---

## 4) Instructions: GitHub MCP — project, issues, and priorities

Execute using **GitHub MCP** tools available in the environment (tool names vary by server; discover schemas before calling). **Intent:**

### 4.1 Create or select a project

- **Create** a new GitHub Project (Projects **v2** / board) associated with **`TauntingRhinomonster/canvas-lms`**, **or** select an existing project if the user pre-created one (match by title, e.g. “Feature 1 – Planner / Better To-do List”).
- Use a clear **project title** and **short description** referencing the feature: planner to-do bucketing with **Push Forward Time (P.F.T.)** — user-configurable local time; items due before P.F.T. appear on the previous day (aligned with `agents/tasks/feature-1/feature-1.md`).

### 4.2 Labels and structure (recommended)

Create or reuse labels such as:

- `feature-1`, `planner`, `frontend`
- `functional-requirement`, `testing`, `dependency` / `spike`
- Optional: `nfr` for non-functional constraints

### 4.3 Issues to create (minimum set)

Map handoff content into **issues**; group related FRs if the board would otherwise be noisy.

| Category | Content source | Suggested issue grouping |
|----------|----------------|---------------------------|
| **Functional** | FR-1 … FR-8 | One issue per FR **or** one issue per FR group with checklists (must preserve AC traceability to FR IDs in the body). |
| **Testing** | Section 5 (unit, integration, manual, AC-1 … AC-6) | At least one **Testing** issue covering `apiUtils.test.js`, planner load/transform path tests, and manual/exploratory checklist bullets. |
| **Dependencies / spikes** | Open questions OQ-1 … OQ-5 (and any “spike/clarification” from section 4) | Separate **Dependency / spike** issues; link blocking relationships if GitHub supports sub-issue / dependency metadata. |

Each issue body must include:

- **Objective** (user-facing or technical).
- **Acceptance criteria** (bullets).
- **Traceability** (subsection per section 3 above).
- **Links** to project **and** milestone/epic as applicable.

### 4.4 Add issues to the project and set priorities

- **Add** every created issue to the target **Project**.
- Set **Priority** (or the project’s priority field) using a consistent scale, for example:
  - **P1 — High:** Core functional stories (FR-1, FR-2, FR-3, FR-5, FR-6, FR-8) and primary unit-test coverage.
  - **P2 — Medium:** FR-4, FR-7, integration tests, NFR-aligned checks.
  - **P3 — Lower:** Spikes / open questions (OQ-*) that do not block initial implementation but affect completeness or product decisions.

If the MCP exposes **Status** columns (Backlog / Ready / In progress / Done), place new items in **Backlog** or **Ready** according to dependency order (spikes that block design may be Ready first).

### 4.5 Optional: milestone and epic

- Create **one milestone** for the feature release slice (name aligned with section 3).
- Optionally create **one epic issue** that lists all FRs and links child issues; attach the epic to the project.

---

## 5) Human verification (you — traceability checklist)

After the agent finishes, **do not** assume the board is correct without checking. Complete this checklist on GitHub:

- [ ] **Correct repo:** Project and all issues live under **`TauntingRhinomonster/canvas-lms`**, not `instructure/canvas-lms`.
- [ ] **Branch alignment:** Default/feature branch for work matches your course fork (**`master`** or the branch your instructor specified).
- [ ] **Handoff coverage:** Every **FR-1 … FR-8** appears as an explicit checkbox, issue, or linked sub-issue; **AC-1 … AC-7** are reflected in testing or functional issues.
- [ ] **`analyze-repo.md` traceability:** Spot-check **three** issues: each includes a **specific** reference to `agents/analyze-repo.md` (section heading or quoted principle), not a vague “see repo guide.”
- [ ] **Implementation map:** Spot-check **two** issues: each cites at least one **file path** from the handoff section 4 (e.g. `ui/shared/planner/utilities/apiUtils.js`).
- [ ] **Priorities:** P1 items are true blockers for a minimal shippable slice; spikes (OQ-*) are not all P1 unless your instructor requires that.
- [ ] **Project linkage:** All listed issues appear **on the Project board** with priority/status fields set.
- [ ] **Dependencies:** Open questions (OQ-1 … OQ-5) are either issues or clearly linked tasks; blocking relationships make sense.
- [ ] **Testing issue:** Includes references to `ui/shared/planner/utilities/__tests__/apiUtils.test.js` and planner actions/sagas test paths from the handoff.

---

## 6) Agent guardrails

- Read **`agents/tasks/feature-1/implementation-research.md`** or **`implementationresearch.md`** and **`agents/analyze-repo.md`** from the workspace **before** creating issues so citations are accurate.
- Do not invent file paths; if unsure, quote only what appears in the handoff or `analyze-repo.md`.
- Prefer **small, verifiable issues** over one oversized issue unless the course explicitly wants a single umbrella issue.

---

## 7) Quick reference — feature summary (for project description)

From `agents/tasks/feature-1/feature-1.md` / implementation research: implement a **better Planner to-do experience** with **Push Forward Time (P.F.T.)** — when enabled, items due **strictly before** the user’s chosen local P.F.T. appear in the **previous day’s** bucket; due **exactly at** P.F.T. stays same-day; disabled/missing preference preserves current behavior; P.F.T. may be any time of day (e.g. 9:00 AM for early dues, 9:00 PM for evening planning); timezone and observer-mode behavior must remain correct per FR/NFR and open questions (OQ-2–OQ-5).
