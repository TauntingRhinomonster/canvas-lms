/*
 * Copyright (C) 2026 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import moment from 'moment-timezone'

export const DEFAULT_PUSH_FORWARD_HOUR = 22

export function normalizePushForwardTimeOptions(candidate) {
  if (
    candidate &&
    typeof candidate.enabled === 'boolean' &&
    typeof candidate.hour === 'number' &&
    Number.isInteger(candidate.hour) &&
    candidate.hour >= 0 &&
    candidate.hour <= 23
  ) {
    return {enabled: candidate.enabled, hour: candidate.hour}
  }

  return null
}

export function readPushForwardTimeFromEnv(env = {}) {
  const candidate =
    env?.PREFERENCES?.push_forward_time ||
    env?.PREFERENCES?.planner_push_forward_time ||
    env?.PUSH_FORWARD_TIME_OPTIONS ||
    env?.PUSH_FORWARD_TIME

  return normalizePushForwardTimeOptions(candidate)
}

export function defaultPushForwardTimeOptions() {
  return {enabled: false, hour: DEFAULT_PUSH_FORWARD_HOUR}
}

export function resolvePushForwardTimeOptions(candidate) {
  return normalizePushForwardTimeOptions(candidate) || defaultPushForwardTimeOptions()
}

export function pushForwardHourOptions(locale = 'en') {
  return Array.from({length: 24}, (_, hour) => ({
    value: hour,
    label: moment().locale(locale).hour(hour).minute(0).second(0).format('LT'),
  }))
}
