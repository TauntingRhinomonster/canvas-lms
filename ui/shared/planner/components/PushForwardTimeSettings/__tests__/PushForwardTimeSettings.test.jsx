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

import React from 'react'
import {render, fireEvent, waitFor} from '@testing-library/react'
import {http, HttpResponse} from 'msw'
import {setupServer} from 'msw/node'
import PushForwardTimeSettings from '../index'

const server = setupServer()

describe('PushForwardTimeSettings', () => {
  beforeAll(() => {
    server.listen()
  })

  beforeEach(() => {
    ENV.PREFERENCES = {push_forward_time: {enabled: false, hour: 22}}
  })

  afterEach(() => {
    server.resetHandlers()
  })

  afterAll(() => {
    server.close()
  })

  it('renders settings trigger', () => {
    const {getByTestId} = render(<PushForwardTimeSettings />)
    expect(getByTestId('push-forward-time-settings-button')).toBeInTheDocument()
  })

  it('persists enabled preference via settings API', async () => {
    const onApplied = vi.fn()
    let savedBody

    server.use(
      http.put('/api/v1/users/self/settings', async ({request}) => {
        savedBody = await request.json()
        return HttpResponse.json({
          push_forward_time: {enabled: true, hour: 22},
        })
      }),
    )

    const {getByTestId} = render(<PushForwardTimeSettings onApplied={onApplied} />)
    fireEvent.click(getByTestId('push-forward-time-settings-button'))
    fireEvent.click(getByTestId('push-forward-time-enabled-toggle'))

    await waitFor(() => {
      expect(savedBody).toEqual({
        push_forward_time_enabled: true,
        push_forward_time_hour: 22,
      })
    })
    expect(onApplied).toHaveBeenCalledWith({enabled: true, hour: 22})
    expect(ENV.PREFERENCES.push_forward_time).toEqual({enabled: true, hour: 22})
  })
})
