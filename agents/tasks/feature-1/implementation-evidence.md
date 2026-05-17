# Implementation evidence — Feature 1 (Planner push-forward / P.F.T.)

This file is the **audit trail** for one delivery slice of Feature 1: configurable **Push Forward Time (P.F.T.)** so planner/to-do items due before the student’s chosen local time appear on the **previous day** (fixing “due at 9:00 AM but still listed today” for day-of planners).

---

## PR

| Field | Value |
|--------|--------|
| **URL** | _TBD — open when branch is pushed and PR is created on `TauntingRhinomonster/canvas-lms`_ |
| **Branch** | _e.g. `feature-1/planner-pft-bucketing` → `master`_ |
| **Title** | _e.g. “Planner: respect user Push Forward Time for to-do day buckets”_ |

**Short description of what changed (fill after PR opens):**

- Extend planner date-bucketing (`getDateBucketMoment` / `transformApiToInternalItem` in `ui/shared/planner/utilities/apiUtils.js`) to use a **user-configurable P.F.T.** instead of (or in addition to) the hardcoded prep-day threshold.
- Add or wire **preference read path** so transform receives P.F.T. (and enable/disable) per research open questions OQ-1 / OQ-2 in `agents/tasks/feature-1/implementationresearch.md`.
- Add/extend unit tests in `ui/shared/planner/utilities/__tests__/apiUtils.test.js` for boundary times (e.g. due 8:59 AM vs 9:00 AM with P.F.T. = 9:00 AM; P.F.T. = 9:00 PM per product examples).
- Optional: minimal UI or settings surface for P.F.T. if in scope for this slice; otherwise document follow-up issue.

---

## Board

**Project (repeatable locator):** GitHub Project on fork **`TauntingRhinomonster/canvas-lms`**, title match **`Feature 1`** / **“Better To-do List”** / **“Planner bucketing”** (confirm in GitHub → Projects).

**Item locator:** Issue **title** or **number** from the project (e.g. “FR-1: Preference-aware bucketing”, issue `#NNN`).

| When | Item (title / #) | Status before | Status after | Notes |
|------|------------------|---------------|--------------|--------|
| _Start of slice_ | _e.g. FR-1 / epic #___ | **Backlog** or **Ready** | **In progress** | Moved via GitHub MCP project field update (or manual + note here). |
| _PR opened_ | _same or “Testing” issue_ | **In progress** | **In review** / **Ready for review** | If your board uses a review column; otherwise keep **In progress** until merge. |
| _After merge_ | _same item(s)_ | _In progress / In review_ | **Complete** / **Done** | Only after merge evidence below. |

**Timestamp policy:** Record **UTC or local date + time** when you move each row (e.g. `2026-05-13 — FR-1 → In progress`).

---

## Merge

| Field | Value |
|--------|--------|
| **Merged?** | **No** (as of last update) — implementation not yet merged to target branch. |
| **Target branch** | `master` on `TauntingRhinomonster/canvas-lms` (confirm with `git remote -v`). |
| **Evidence** | _After merge: link to **merged PR** (GitHub “Merged” state) **or** commit SHA on `master` from `git log -1 --oneline origin/master` matching the PR merge commit._ |

**If merge is blocked by policy (instructor must merge):**

- Provide **PR URL** once open and a **readiness summary**: CI/checks green (or list failures), review requested, scope matches FR-1–FR-3 + tests in `implementationresearch.md` §5, no secrets in diff, small reviewable PR.
- Instructor may merge on your behalf; this file still satisfies “merge evidence” when the PR shows **Merged** or `master` contains the merge commit.

---

## Plan trace

Feature 1 is defined in `agents/tasks/feature-1/feature-1.md` (better to-do / planner organization) and decomposed in `agents/tasks/feature-1/implementationresearch.md` (FR-1–FR-8, planner `apiUtils.js` bucketing, AC-1–AC-7). The **course project plan** is created and tracked per `agents/project-creation.md` on **`TauntingRhinomonster/canvas-lms`**, with issues mapped from FR/NFR/testing sections and traceability to `agents/analyze-repo.md`. **This slice** delivers the student-facing **Push Forward Time (P.F.T.)** behavior: any assignment due **before** the user’s chosen local time (e.g. 9:00 PM) appears on the **prior day’s** to-do list, addressing early-morning due times (e.g. 9:00 AM) that otherwise mislead day-of workers. End-to-end procedure for selecting board items, implementing, checking, and opening PRs lives in `agents/feature-implementation.md`. Until a PR is merged, this evidence file records **intent and board motion**; update **PR** and **Merge** rows when the PR exists and lands on `master`.
