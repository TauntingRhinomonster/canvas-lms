# Memory technique or library (name)

**Explicit re-grounding triggers after merges or upstream pulls**

We treat the agent’s working memory (conversation context, prior assumptions about files and APIs) as **stale after any significant change to the tree**—especially `git merge`, `git pull`, rebase, or large cherry-picks from upstream Canvas LMS. Instead of relying on remembered paths, flags, or “last time we saw” behavior, we **force a deliberate re-read** of the repo and project conventions before continuing substantive work.

# Connection to Lab 2 agent or other agents

This practice applies to **any coding or review agent** that operates on this Canvas LMS workspace (Lab 2 agent, PR babysitting agents, exploration agents, etc.). It is orthogonal to a specific library: it is a **workflow contract** between the human operator and the agent so that post-merge sessions do not silently inherit outdated mental models of `app/`, `ui/`, feature flags, or local overrides.

# Procedure (prompts / file rituals)

1. **Trigger events (always re-ground when any apply)**  
   - Completed merge (local or from remote).  
   - `git pull` / `git fetch` + fast-forward or merge.  
   - Rebase that rewrote recent history touching files the task cares about.  
   - Switching branches for a new assignment on the same chat thread.

2. **Prompt ritual (paste or paraphrase to the agent)**  
   - State plainly: *“We just merged / pulled upstream; assume your prior file and API knowledge may be wrong. Re-ground before editing.”*  
   - Ask the agent to: re-read `AGENTS.md` (or `CLAUDE.md`) for current commands and layout; re-open the specific files or areas implicated by the task; and **not** assume line numbers or symbol locations from earlier in the thread without verification.

3. **File / repo rituals**  
   - Optionally point the agent at `git log -1 --oneline` or the merge commit message so it knows *what* changed at a high level.  
   - For Canvas-specific work, remind the agent to re-check feature-flag names and plugin paths under `gems/plugins/` if the merge touched configuration or dependencies.

4. **Resume work only after**  
   - The agent has stated what it re-read and what it is treating as current scope—so the human can catch obvious misses before more edits land.

# Purge / refresh / last verified (as applicable)

- **Purge:** We do not rely on “forgetting” the old context; we **invalidate** it procedurally by requiring fresh reads and explicit acknowledgment after merges/pulls.  
- **Refresh:** Each re-grounding pass should include at least project guidance (`AGENTS.md`) and the files directly involved in the next change set.  
- **Last verified:** Update this line when you adopt or audit the practice: *Last verified: 2026-05-13 (document initial creation).*

# Failure modes and mitigations

| Failure mode | Mitigation |
|--------------|------------|
| Agent edits the wrong file or duplicate path after tree reshuffle | Require listing paths from a fresh search or `read_file` after the merge, not from memory. |
| Agent trusts an old API or flag name | Re-ground with “verify against current repo”; grep or read definitions before changing call sites. |
| Human skips the ritual because the merge “looked small” | Treat *any* pull that could touch the task’s modules as a trigger; small diffs can still rename one critical constant. |
| Conversation bloat causes the agent to weight old turns | Explicit trigger message + “ignore earlier line numbers unless re-verified” reduces weight on stale specifics. |

# Evidence excerpt (no secrets)

*Paste a short, redacted chat excerpt here after your next merge/pull + re-grounding session (e.g., the user’s trigger message and the agent’s acknowledgment of what it re-read).*

**Staleness and over-trust:** We mitigate **staleness** by tying authoritative state to the **current working tree** (fresh reads, searches, and merge awareness) rather than to earlier turns. We mitigate **over-trust** by requiring the agent to **show its sources** (which files or docs it re-opened) and by instructing it not to treat prior conversation details as ground truth until re-verified after integration events.
