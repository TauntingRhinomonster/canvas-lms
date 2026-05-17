# Implementation Research: Better To-do List (Push Forward Time / P.F.T.)

## Feature statement

Implement a better Planner to-do experience that organizes items based on user preference using **Push Forward Time (P.F.T.)** — a **configurable local time** chosen by the student (any time of day):

- When the preference is **enabled**, any planner item due **before** the user’s P.F.T. (in their local timezone) is shown on the **previous calendar day** as work to do.
- This fixes day-of planners waking up to items due early (e.g. **9:00 AM**) that still appeared on “today” in the default bucket.
- Example: P.F.T. = **9:00 PM** → assignments due before 9:00 PM appear one day earlier on the list; an assignment due at **8:59 PM** buckets to the prior day, while one due at **9:00 PM** stays on the due date’s day (boundary).
- Example: P.F.T. = **9:00 AM** → anything due before 9:00 AM that morning is pushed to the previous day’s list.

Source brief: `agents/tasks/feature-1/feature-1.md`. Procedure and evidence: `agents/feature-implementation.md`, `agents/tasks/feature-1/implementation-evidence.md`.

---

## 1) Design considerations

### User flow and interaction model

- Users view planner items grouped by day.
- A new/extended preference stores **P.F.T. enabled/disabled** and the **P.F.T. value** (local time-of-day).
- When enabled, items due **strictly before** P.F.T. are bucketed to the **previous day**.
- When disabled or unset, default bucketing behavior remains unchanged (including today’s hardcoded `PLANNER_PREP_DAY_HOUR = 22` path where applicable).

### Design choices and tradeoffs

1. **Keep bucketing logic centralized**
   - Existing day-bucketing logic already lives in `ui/shared/planner/utilities/apiUtils.js` (`getDateBucketMoment`).
   - Tradeoff: concentrated complexity in one utility, but this is safer and easier to test than duplicating logic in reducers/components.

2. **Honor user preference at transform boundary**
   - Apply P.F.T. during API → internal transform (`transformApiToInternalItem`) so downstream reducers/UI remain simple.
   - Tradeoff: additional input dependency (P.F.T. value + enable flag) must be threaded where transform is called.

3. **Backwards-compatible default**
   - If preference is absent/unset/disabled, preserve current behavior.
   - Tradeoff: mixed behavior across users until preference rollout is complete, but this avoids surprise regressions.

4. **Timezone-first interpretation**
   - Use existing timezone-aware moment handling to avoid UTC/local mismatches.
   - Tradeoff: requires careful tests around boundary times and DST transitions.

5. **Configurable threshold (product decision)**
   - P.F.T. replaces a single fixed “10 PM” rule with **per-user** local time; validation should reject invalid times and fall back safely (NFR-4).

### Interaction with existing Canvas concepts

- **Planner item types**: assignment/discussion/calendar/planner note handling remains unchanged except date bucket assignment.
- **Observee mode**: due-date bucketing should be based on viewer session timezone and their preference setting (pending product confirmation — OQ-3).
- **Course/group/account contexts**: context derivation in planner items remains intact.

---

## 2) Functional requirements

### In scope

FR-1. **P.F.T.-aware bucketing**
- Given a planner item with due datetime and P.F.T. preference **enabled** with value **T** (local time-of-day),
- when due local time is **strictly before** **T** on the due date’s calendar day,
- then item renders in the **previous day** bucket.

FR-2. **Boundary behavior at exactly P.F.T.**
- Given preference enabled with P.F.T. = **T** and due time **exactly** **T** local,
- when item is transformed,
- then item remains in its **same-day** bucket (not moved).

FR-3. **No preference regression**
- Given P.F.T. preference **disabled** or missing,
- when item is transformed,
- then existing bucketing behavior is preserved (no change from current Canvas behavior for that user).

FR-4. **Type safety for non-due-date cases**
- Given planner notes/all-day events or items without due time,
- when transformed,
- then existing behavior is unchanged.

FR-5. **Timezone correctness**
- Given user timezone and API plannable date,
- when bucket is computed,
- then calculation is based on local timezone (not raw UTC clock hour).

FR-6. **Deterministic internal output**
- Given identical input payload + timezone + P.F.T. state (enabled + value),
- when transformed,
- then output `dateBucketMoment` is deterministic.

FR-7. **Observer mode compatibility**
- Given planner loaded with `observed_user_id`,
- when transforming and grouping items,
- then date bucketing logic still applies consistently without breaking observer queries.

FR-8. **Configurable P.F.T. value**
- Given preference enabled,
- when the user sets P.F.T. to any valid time of day (e.g. 9:00 AM, 12:00 PM, 9:00 PM),
- then bucketing uses that value as **T** for FR-1 and FR-2.

### Out of scope

- Full preference **UI polish** beyond what is required to read/set P.F.T. (minimal settings surface may be a separate issue).
- Any backend endpoint redesign for planner items.
- Refactors unrelated to planner bucketing.
- Full Planner architecture migration (e.g., JS → TS).

---

## 3) Non-functional requirements

NFR-1. **Performance**
- No measurable degradation in planner load/transform performance.
- Bucketing logic remains O(1) per item.

NFR-2. **Security and privacy**
- No additional student data exposure.
- Observer mode request scope remains unchanged.

NFR-3. **Accessibility**
- No a11y regression in planner rendering; only grouping/date bucket changes.

NFR-4. **Observability**
- Failures in load flow continue to surface through existing planner alerts/error handling.
- If P.F.T. value is missing/invalid, behavior falls back cleanly without crashing (prefer disabled/default bucketing).

NFR-5. **Reliability**
- Logic is robust across DST boundaries and timezone conversions.
- Existing planner item type handling remains stable.

NFR-6. **Compatibility**
- Works in current Canvas planner architecture and test setup.
- No breaking changes to existing planner API payload assumptions.

---

## 4) Codebase analysis using Lab 2 guidance

Repository analysis source: `agents/analyze-repo.md`.

### Hypotheses (likely change locations)

- `ui/shared/planner/utilities/apiUtils.js`
  - `getDateBucketMoment`
  - `transformApiToInternalItem`
- `ui/shared/planner/actions/loading-actions.js` and/or planner load call sites
  - to pass P.F.T. preference into transform layer if needed
- `ui/shared/planner/utilities/__tests__/apiUtils.test.js`
  - primary tests for bucketing behavior and edge cases

### Concrete findings from exploration

1. `getDateBucketMoment` currently uses a hardcoded threshold (`PLANNER_PREP_DAY_HOUR = 22`, i.e. 10:00 PM) and moves non-note, non-all-day items before that hour to the prior day when the legacy path applies.
2. **Product direction:** replace or override that fixed hour with **user P.F.T.** when the feature preference is enabled; keep legacy behavior when disabled (FR-3).
3. `transformApiToInternalItem` computes `plannableDate` via timezone-aware `moment.tz(...)` and sets `dateBucketMoment` via `getDateBucketMoment(...)`.
4. Planner has extensive existing unit tests in `ui/shared/planner/utilities/__tests__/apiUtils.test.js`, including date-bucket expectations.
5. Planner fetch/load orchestration is split across `ui/shared/planner/actions/index.js` and `ui/shared/planner/actions/sagas.js`; observer and course scoping are already handled there.
6. Existing logic is well-positioned for a P.F.T.-aware extension without broad reducer/component rewrites.

### Open questions (spike/clarification needed)

OQ-1. ~~Is the threshold fixed or configurable?~~ **Resolved:** per-user **configurable P.F.T.** (FR-8).

OQ-2. Where is P.F.T. stored (user settings, profile, ENV, new API field)? Default value when first enabled?

OQ-3. In observee mode, should bucketing follow observer P.F.T., observee P.F.T., or institution default?

OQ-4. Should calendar events with explicit end times but not all-day follow the same rule as assignments?

OQ-5. Should weekly dashboard behavior match standard planner exactly for this feature?

---

## 5) Testing and verification plan

### Unit-level tests

Primary file: `ui/shared/planner/utilities/__tests__/apiUtils.test.js`

- Add/extend tests for (use explicit **T** = P.F.T. in each case):
  - **Early-morning due (motivating case):** P.F.T. enabled, **T** = 9:00 AM, due 8:59 AM → previous day; due 9:00 AM → same day.
  - **Evening P.F.T. example:** **T** = 9:00 PM, due 8:59 PM → previous day; due 9:00 PM → same day.
  - P.F.T. disabled/missing → current/default behavior (legacy `PLANNER_PREP_DAY_HOUR` path unchanged).
  - Planner notes and all-day events unaffected.
  - Timezone edge examples (at least one non-UTC zone).
  - Optional: second **T** (e.g. noon) to prove FR-8 is not hardcoded to one hour.

### Integration points

- Planner load path tests in `ui/shared/planner/actions/__tests__/...`
  - verify P.F.T. preference reaches transform path where required
  - ensure observer/single-course loading still works

### Manual/exploratory checks

1. Set P.F.T. to **9:00 PM**; create assignments due 8:00 PM, 8:59 PM, 9:00 PM, and 11:00 PM local — verify bucket days.
2. Set P.F.T. to **9:00 AM**; create assignments due 8:00 AM, 8:59 AM, 9:00 AM — verify early dues appear on the **previous** list day when expected.
3. Toggle preference off/on and verify bucket day changes accordingly.
4. Validate in at least two timezones (or mocked timezone tests).
5. Validate no regressions for planner notes/all-day calendar items.
6. Validate observee flow still loads and groups items correctly.

### Acceptance criteria mapped to requirements

- AC-1 (FR-1 / FR-8): Items due strictly before user’s P.F.T. **T** move to previous day when preference enabled.
- AC-2 (FR-2): Due time exactly at **T** remains same-day.
- AC-3 (FR-3): Disabled/unset preference preserves baseline behavior.
- AC-4 (FR-4): Planner notes/all-day items unchanged.
- AC-5 (FR-5 / FR-6): Timezone-aware, deterministic bucket outcomes in tests.
- AC-6 (FR-7): Observer mode behavior remains functional with no request/regression issues.
- AC-7 (FR-8): Changing **T** (e.g. 9:00 AM vs 9:00 PM) changes bucketing per tests without code change to a fixed hour.

### If automation is impractical

For environment-limited cases (real timezone switching, observee setup), use a manual checklist and record:

- user/account context
- timezone
- P.F.T. enabled + **T** value
- due datetime input
- expected day bucket vs observed day bucket
