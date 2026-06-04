/*
 * Copyright (C) 2017 - present Instructure, Inc.
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
import rootReducer from '../index'

it('sets the default state for all properties empty initial state', () => {
  const newState = rootReducer({}, {type: 'FAKE_ACTION'})
  expect(newState).toMatchObject({
    courses: [],
    groups: [],
    locale: 'en',
    timeZone: 'UTC',
    days: [],
    loading: {
      isLoading: false,
    },
    firstNewActivityDate: null,
    selectedObservee: null,
  })
})

it('clones the first new activity date moment', () => {
  const initialState = rootReducer({}, {type: 'blah'})
  const mockMoment = moment()
  const nextState = rootReducer(initialState, {
    type: 'FOUND_FIRST_NEW_ACTIVITY_DATE',
    payload: mockMoment,
  })
  expect(nextState.firstNewActivityDate).not.toBe(mockMoment)
})

it('reads push_forward_time from INITIAL_OPTIONS env preferences', () => {
  const nextState = rootReducer(
    {},
    {
      type: 'INITIAL_OPTIONS',
      payload: {
        env: {
          MOMENT_LOCALE: 'en',
          TIMEZONE: 'UTC',
          STUDENT_PLANNER_GROUPS: [],
          current_user: {id: 1, display_name: 'Test User'},
          PREFERENCES: {
            push_forward_time: {enabled: true, hour: 9},
          },
        },
      },
    },
  )
  expect(nextState.pushForwardTimeOptions).toEqual({enabled: true, hour: 9})
})

it('ignores invalid push_forward_time preference values', () => {
  const nextState = rootReducer(
    {},
    {
      type: 'INITIAL_OPTIONS',
      payload: {
        env: {
          MOMENT_LOCALE: 'en',
          TIMEZONE: 'UTC',
          STUDENT_PLANNER_GROUPS: [],
          current_user: {id: 1, display_name: 'Test User'},
          PREFERENCES: {
            push_forward_time: {enabled: true, hour: 9.5},
          },
        },
      },
    },
  )
  expect(nextState.pushForwardTimeOptions).toBeNull()
})
