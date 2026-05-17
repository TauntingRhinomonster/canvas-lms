# Feature implementation runbook — Feature 1 (Planner P.F.T. / better to-do)

Use this document as the **repeatable procedure** for implementing Feature 1 on the Canvas LMS fork: **Push Forward Time (P.F.T.)** — students set a local time (e.g. 9:00 PM); planner/to-do items with a due time **before** that threshold appear on the **previous calendar day**, so early-morning dues (e.g. 9:00 AM) do not surprise day-of planners.

---

## Feature summary (this lab)

| Concept | Behavior |
|---------|----------|
| **Problem** | Default planner day buckets can show an item “today” even when it is due early (e.g. 9:00 AM), which is too late for students who work the day of. |
| **P.F.T.** | User-configurable **Push Forward Time** (any time of day). |
| **Rule** | If due **&lt; P.F.T.** local → bucket item on **previous day**; at or after P.F.T. → **same day** (align boundary tests with research FR-2 style). |
| **Example** | P.F.T. = 9:00 PM → anything due before 9:00 PM shows one day earlier on the list. |
| **Default** | Preference off or unset → preserve existing Canvas bucketing (no regression). |

Primary code hypotheses: `ui/shared/planner/utilities/apiUtils.js` (`getDateBucketMoment`, `transformApiToInternalItem`); tests in `ui/shared/planner/utilities/__tests__/apiUtils.test.js`.

---

## Inputs

Locate artifacts **by path** (workspace-relative from repo root):

| Artifact | Path | Use |
|----------|------|-----|
| Feature brief | `agents/tasks/feature-1/feature-1.md` | One-paragraph product intent |
| Implementation research | `agents/tasks/feature-1/implementationresearch.md` | FR/NFR, codebase map, AC, test plan |
| Implementation evidence (this slice) | `agents/tasks/feature-1/implementation-evidence.md` | PR, board moves, merge proof |
| Repo analysis | `agents/analyze-repo.md` | Where to edit (`ui/`), validation commands |
| Project/issue creation spec | `agents/project-creation.md` | Fork owner, labels, FR → issue mapping |
| Memory / re-grounding | `agents/memory-practice.md` | After `git pull` / merge on upstream |
| Infra (optional) | `agents/aws-canvas-runbook.md` | Docker / EC2 dev host |

**GitHub Project (repeatable):**

1. Open **https://github.com/users/TauntingRhinomonster/projects** or the repo **Projects** tab for **`TauntingRhinomonster/canvas-lms`**.
2. Select the project whose **title** contains **`Feature 1`** or **`Better To-do List`** / **`Planner`** (same naming as `agents/project-creation.md` §4.1).
3. Find work items by **issue number** (e.g. `#12`) or **exact title** (e.g. `FR-1: P.F.T.-aware bucketing`) — use the same locator every time; record number + title in `implementation-evidence.md`.

**Branch:** `master` on the fork unless the course specifies a topic branch (`git remote -v`).

---

## Procedure

Ordered steps for one board item (or a small group, e.g. FR-1 + tests):

1. **Select item**  
   - From the GitHub Project, pick the next **Ready** (or **Backlog**) issue for this slice (prefer P1 per `project-creation.md`).  
   - Read linked FR/AC in the issue body and skim `implementationresearch.md` §2–§5 for that FR.

2. **MCP board update → In progress**  
   - Using GitHub MCP (see **MCP** below), set the project **Status** field to **In progress** (or your board’s equivalent).  
   - Log **date/time** and issue **# / title** in `implementation-evidence.md` → **Board**.

3. **Implementation session(s)**  
   - Create a **feature branch** from `master` (never commit directly to protected default if policy forbids it).  
   - Implement P.F.T.-aware bucketing and preference plumbing per research §4; keep PRs **small** (one FR group + tests per PR when possible).  
   - Re-ground after merges: `agents/memory-practice.md`.

4. **Run checks you care about** (minimum before PR):  
   ```bash
   cd /home/ubuntu/canvas-lms
   yarn test ui/shared/planner/utilities/__tests__/apiUtils.test.js
   yarn check:ts   # if you touched TS or types leak from JS
   ```  
   - Optional: `yarn lint` on touched paths; manual planner check on Docker (`agents/aws-canvas-runbook.md`) with assignments at 8:00 AM / 9:00 AM and P.F.T. toggles.

5. **Open PR**  
   - Push branch to **`TauntingRhinomonster/canvas-lms`**.  
   - Open PR → **`master`**; title/body reference **FR-#**, **AC-#**, and file paths.  
   - Update `implementation-evidence.md` → **PR** (URL + short description).

6. **After merge → MCP update to Complete**  
   - Confirm **Merged** on GitHub or merge commit on `origin/master`.  
   - Update `implementation-evidence.md` → **Merge**.  
   - Set project **Status** to **Complete** / **Done** for the issue(s) delivered in that PR.  
   - Log final board row in **Board** table.

---

## MCP

**Server:** Same **GitHub MCP** as Lab 2.2 (`user-github` in Cursor). Discover tool schemas under the MCP tools folder before calling.

**Typical patterns:**

| Intent | MCP-style action |
|--------|------------------|
| Find issue | `search_issues` / `list_issues` on `TauntingRhinomonster/canvas-lms` with label `feature-1` or title keyword |
| Read issue | `get_issue` |
| Comment progress | `add_issue_comment` |
| Open PR | `create_pull_request` (after branch exists on remote) |
| PR status | `get_pull_request`, `get_pull_request_status` |
| Board / Project v2 | Use **Projects** toolset when exposed (field updates for **Status**, **Priority**); tool names vary — list MCP descriptors before use |

**Projects toolset:** Update item **Status** (`Backlog` → `In progress` → `Complete`) and **Priority** per `agents/project-creation.md` §4.4.

**If MCP is temporarily unavailable:**

1. Perform the step in the **GitHub UI** (Projects board drag or issue sidebar; PR via web).  
2. **Log honestly** in `implementation-evidence.md` (Board / PR / Merge) with timestamp and manual action (“Status set via UI — MCP offline”).  
3. Do not claim MCP updates you did not perform.

---

## Guardrails

- **No secrets** in issues, PRs, comments, or agent docs (no AWS keys, `.pem`, tokens, private IPs).  
- **No direct push to protected branches** if course/instructor policy forbids it — use feature branches + PR to `master`.  
- **Fork only** for issues/projects: `TauntingRhinomonster/canvas-lms`, not `instructure/canvas-lms`.  
- **Small, reviewable PRs** — prefer one FR cluster + tests over a monolith; link follow-ups as new issues.  
- **Traceability** — PR body cites `agents/analyze-repo.md` + handoff paths/symbols (`apiUtils.js`, `getDateBucketMoment`).  
- **No invented paths** — only files named in `implementationresearch.md` or verified in repo search.

---

## Verification

Consider a board item **complete** only when **all** apply:

| Check | Requirement |
|-------|-------------|
| **Merge** | PR **merged** to target branch (or instructor merge documented with PR URL + readiness per `implementation-evidence.md`). |
| **Board** | Project status **Complete** / **Done**; evidence table updated. |
| **Unit tests** | `apiUtils.test.js` covers P.F.T. enabled/disabled, boundary at P.F.T., notes/all-day unchanged (research §5, AC-1–AC-4). |
| **FR coverage** | Issue acceptance criteria met for this slice (at minimum FR-1–FR-3, FR-5–FR-6, FR-8 for first shippable P.F.T. bucketing). |
| **Regression** | Preference off → legacy behavior; no crash on missing/invalid P.F.T. (NFR-4). |
| **Manual (if env allows)** | Docker Canvas on port 3000; create/view planner items with dues before/after P.F.T.; optional second timezone. |
| **Docs** | `implementation-evidence.md` filled (PR link, board moves, merge proof, plan trace). |

**Out of scope for “complete” on a single item:** Unrelated Canvas features, full preference UI polish (unless issue scope includes it), resolving all OQ-2–OQ-5 spikes unless that issue is explicitly the task.
