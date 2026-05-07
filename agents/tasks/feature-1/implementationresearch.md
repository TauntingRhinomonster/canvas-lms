# Implementation Research: Better To-do List

## Feature statement

Implement a better Planner to-do experience that organizes items based on user preference:

- If a user prefers it, any item due before 10:00 PM local time is shown on the **previous day** as work to do.
- This helps users plan earlier and avoid interpreting late-evening due items as "due tomorrow at midnight."

Source brief: `agents/tasks/feature-1/feature-1.md`.

---

## 1) Design considerations

### User flow and interaction model

- Users view planner items grouped by day.
- A new/extended preference controls "early evening due-date bucketing."
- When enabled, items due before 10 PM are bucketed to the previous day.
- When disabled, default bucketing behavior remains unchanged.

### Design choices and tradeoffs

1. **Keep bucketing logic centralized**
   - Existing day-bucketing logic already lives in `ui/shared/planner/utilities/apiUtils.js` (`getDateBucketMoment`).
   - Tradeoff: concentrated complexity in one utility, but this is safer and easier to test than duplicating logic in reducers/components.

2. **Honor user preference at transform boundary**
   - Apply preference during API -> internal transform (`transformApiToInternalItem`) so downstream reducers/UI remain simple.
   - Tradeoff: additional input dependency (preference value) must be threaded where transform is called.

3. **Backwards-compatible default**
   - If preference is absent/unset, preserve current behavior.
   - Tradeoff: mixed behavior across users until preference rollout is complete, but this avoids surprise regressions.

4. **Timezone-first interpretation**
   - Use existing timezone-aware moment handling to avoid UTC/local mismatches.
   - Tradeoff: requires careful tests around boundary times and DST transitions.

### Interaction with existing Canvas concepts

- **Planner item types**: assignment/discussion/calendar/planner note handling remains unchanged except date bucket assignment.
- **Observee mode**: due-date bucketing should be based on viewer session timezone and their preference setting (pending product confirmation).
- **Course/group/account contexts**: context derivation in planner items remains intact.

---

## 2) Functional requirements

### In scope

FR-1. **Preference-aware bucketing**
- Given a planner item with due datetime and a user preference enabled,
- when due time is before 10:00 PM local timezone,
- then item renders in previous day bucket.

FR-2. **Boundary behavior at exactly 10:00 PM**
- Given preference enabled and due time exactly 10:00 PM local,
- when item is transformed,
- then item remains in its same-day bucket (not moved).

FR-3. **No preference regression**
- Given preference disabled or missing,
- when item is transformed,
- then existing bucketing behavior is preserved.

FR-4. **Type safety for non-due-date cases**
- Given planner notes/all-day events or items without due time,
- when transformed,
- then existing behavior is unchanged.

FR-5. **Timezone correctness**
- Given user timezone and API plannable date,
- when bucket is computed,
- then calculation is based on local timezone (not raw UTC clock hour).

FR-6. **Deterministic internal output**
- Given identical input payload + timezone + preference state,
- when transformed,
- then output `dateBucketMoment` is deterministic.

FR-7. **Observer mode compatibility**
- Given planner loaded with `observed_user_id`,
- when transforming and grouping items,
- then date bucketing logic still applies consistently without breaking observer queries.

### Out of scope

- New UI for managing user preferences (unless required to read an already existing setting).
- Any backend endpoint redesign for planner items.
- Refactors unrelated to planner bucketing.
- Full Planner architecture migration (e.g., JS -> TS).

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
- If preference value is missing/invalid, behavior falls back cleanly without crashing.

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
  - to pass preference into transform layer if needed
- `ui/shared/planner/utilities/__tests__/apiUtils.test.js`
  - primary tests for bucketing behavior and edge cases

### Concrete findings from exploration

1. `getDateBucketMoment` currently uses a hardcoded threshold (`PLANNER_PREP_DAY_HOUR = 22`) and moves non-note, non-all-day items before threshold to prior day.
2. `transformApiToInternalItem` computes `plannableDate` via timezone-aware `moment.tz(...)` and sets `dateBucketMoment` via `getDateBucketMoment(...)`.
3. Planner has extensive existing unit tests in `ui/shared/planner/utilities/__tests__/apiUtils.test.js`, including a date-bucket expectation.
4. Planner fetch/load orchestration is split across `ui/shared/planner/actions/index.js` and `ui/shared/planner/actions/sagas.js`; observer and course scoping are already handled there.
5. Existing logic is well-positioned for a preference-aware extension without broad reducer/component rewrites.

### Open questions (spike/clarification needed)

OQ-1. Is 10 PM a globally fixed threshold or per-user configurable threshold value?

OQ-2. Is this preference already stored in user settings/ENV, or do we need a new source of truth?

OQ-3. In observee mode, should bucketing follow observer preference, observee preference, or institution default?

OQ-4. Should calendar events with explicit end times but not all-day follow the same rule as assignments?

OQ-5. Should weekly dashboard behavior match standard planner exactly for this feature?

---

## 5) Testing and verification plan

### Unit-level tests

Primary file: `ui/shared/planner/utilities/__tests__/apiUtils.test.js`

- Add/extend tests for:
  - preference enabled + due at 9:59 PM -> previous day
  - preference enabled + due at 10:00 PM -> same day
  - preference disabled/missing -> current/default behavior
  - planner notes and all-day events unaffected
  - timezone edge examples (at least one non-UTC zone)

### Integration points

- Planner load path tests in `ui/shared/planner/actions/__tests__/...`
  - verify preference value reaches transform path where required
  - ensure observer/single-course loading still works

### Manual/exploratory checks

1. Create/identify assignments due at 8 PM, 9:59 PM, 10 PM, and 11 PM local.
2. Toggle preference off/on and verify bucket day changes accordingly.
3. Validate in at least two timezones (or mocked timezone tests).
4. Validate no regressions for planner notes/all-day calendar items.
5. Validate observee flow still loads and groups items correctly.

### Acceptance criteria mapped to requirements

- AC-1 (FR-1): Items due before 10 PM move to previous day when preference enabled.
- AC-2 (FR-2): 10 PM exact boundary remains same-day.
- AC-3 (FR-3): Disabled/unset preference preserves baseline behavior.
- AC-4 (FR-4): Planner notes/all-day items unchanged.
- AC-5 (FR-5/FR-6): Timezone-aware, deterministic bucket outcomes in tests.
- AC-6 (FR-7): Observer mode behavior remains functional with no request/regression issues.

### If automation is impractical

For environment-limited cases (real timezone switching, observee setup), use a manual checklist and record:

- user/account context
- timezone
- preference state
- due datetime input
- expected day bucket vs observed day bucket

