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

import {
  DEFAULT_PUSH_FORWARD_HOUR,
  normalizePushForwardTimeOptions,
  readPushForwardTimeFromEnv,
  resolvePushForwardTimeOptions,
  pushForwardHourOptions,
} from '../pushForwardTimePreference'

describe('pushForwardTimePreference', () => {
  it('normalizes valid options', () => {
    expect(normalizePushForwardTimeOptions({enabled: true, hour: 9})).toEqual({
      enabled: true,
      hour: 9,
    })
  })

  it('rejects invalid hour values', () => {
    expect(normalizePushForwardTimeOptions({enabled: true, hour: 9.5})).toBeNull()
    expect(normalizePushForwardTimeOptions({enabled: true, hour: 24})).toBeNull()
  })

  it('reads preference from env.PREFERENCES.push_forward_time', () => {
    expect(
      readPushForwardTimeFromEnv({
        PREFERENCES: {push_forward_time: {enabled: false, hour: 21}},
      }),
    ).toEqual({enabled: false, hour: 21})
  })

  it('falls back to default options when env preference is missing', () => {
    expect(resolvePushForwardTimeOptions(null)).toEqual({
      enabled: false,
      hour: DEFAULT_PUSH_FORWARD_HOUR,
    })
  })

  it('builds 24 hour options', () => {
    expect(pushForwardHourOptions('en')).toHaveLength(24)
    expect(pushForwardHourOptions('en')[0].value).toBe(0)
    expect(pushForwardHourOptions('en')[23].value).toBe(23)
  })
})
