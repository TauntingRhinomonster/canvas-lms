# Feature 1 — Spike decisions (OQ-3 through OQ-5)

Decisions recorded for open product/engineering spikes after P.F.T. implementation (PRs #14–#17).

## OQ-3 — Observee mode: whose preference applies?

**Decision (v1):** Use the **logged-in user's** Push Forward Time preference (observer or student), sourced from `ENV.PREFERENCES.push_forward_time` at planner init.

**Rationale:** Preference is stored per authenticated user and threaded through Redux at dashboard load. Observer flows already pass the same transform options when loading with `observed_user_id` (see PR #15 integration tests).

**Follow-up (optional):** If product requires observee-specific bucketing, load the observed student's `push_forward_time` when `observed_user_id` is set and pass that into transform instead.

## OQ-4 — Calendar events: same bucketing rule as assignments?

**Decision:** **Yes** for timed (non-all-day) calendar events.

**Rationale:** `getDateBucketMoment` in `apiUtils.js` applies the threshold to all items except `planner_note` and all-day events (`plannable.all_day`). Timed calendar events use the same due/start datetime path as assignments.

**Out of scope:** Changing calendar-specific display outside planner list bucketing.

## OQ-5 — Weekly dashboard parity with standard planner

**Decision:** **Bucketing parity yes** (shared transform); **UI surface partial**.

**Rationale:** Both standard and weekly planner load paths call `transformApiToInternalItem` with `pushForwardTimeOptions` from Redux (`loading-actions.js`). K5/weekly views use the same bucketing logic when items are transformed.

**Gap:** Push Forward Time **settings UI** is on the classic dashboard List View header (PR #17). K5 weekly dashboard does not yet expose the settings control — users can still set preference via API or profile-adjacent settings API.

**Scope:** No separate weekly-specific bucketing fork unless product requests different behavior.
