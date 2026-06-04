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

import React, {useMemo, useState} from 'react'
import PropTypes from 'prop-types'
import {useScope as createI18nScope} from '@canvas/i18n'
import doFetchApi from '@canvas/do-fetch-api-effect'
import {showFlashAlert} from '@instructure/platform-alerts'
import {IconButton} from '@instructure/ui-buttons'
import {IconSettingsLine} from '@instructure/ui-icons'
import {Popover} from '@instructure/ui-popover'
import {View} from '@instructure/ui-view'
import {Text} from '@instructure/ui-text'
import {Checkbox} from '@instructure/ui-checkbox'
import {SimpleSelect} from '@instructure/ui-simple-select'
import {ScreenReaderContent} from '@instructure/ui-a11y-content'
import {
  pushForwardHourOptions,
  readPushForwardTimeFromEnv,
  resolvePushForwardTimeOptions,
} from '../../utilities/pushForwardTimePreference'

const I18n = createI18nScope('planner')

async function savePushForwardTimePreference({enabled, hour}) {
  await doFetchApi({
    path: '/api/v1/users/self/settings',
    method: 'PUT',
    body: {
      push_forward_time_enabled: enabled,
      push_forward_time_hour: hour,
    },
  })
}

export default function PushForwardTimeSettings({locale, onApplied}) {
  const initialOptions = useMemo(
    () => resolvePushForwardTimeOptions(readPushForwardTimeFromEnv(ENV)),
    [],
  )
  const [open, setOpen] = useState(false)
  const [enabled, setEnabled] = useState(initialOptions.enabled)
  const [hour, setHour] = useState(initialOptions.hour)
  const [saving, setSaving] = useState(false)

  const hourOptions = useMemo(() => pushForwardHourOptions(locale), [locale])

  const persist = async nextOptions => {
    setSaving(true)
    try {
      await savePushForwardTimePreference(nextOptions)
      if (ENV.PREFERENCES) {
        ENV.PREFERENCES.push_forward_time = nextOptions
      }
      onApplied?.(nextOptions)
    } catch {
      showFlashAlert({
        message: I18n.t('Failed to save push forward time preference'),
        type: 'error',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleEnabledChange = event => {
    const nextEnabled = event.target.checked
    const nextOptions = {enabled: nextEnabled, hour}
    setEnabled(nextEnabled)
    persist(nextOptions)
  }

  const handleHourChange = (_event, {value}) => {
    const nextHour = Number(value)
    const nextOptions = {enabled, hour: nextHour}
    setHour(nextHour)
    persist(nextOptions)
  }

  return (
    <Popover
      isShowingContent={open}
      onShowContent={() => setOpen(true)}
      onHideContent={() => setOpen(false)}
      on="click"
      placement="bottom end"
      renderTrigger={
        <IconButton
          renderIcon={IconSettingsLine}
          screenReaderLabel={I18n.t('Push forward time settings')}
          withBorder={false}
          withBackground={false}
          data-testid="push-forward-time-settings-button"
        />
      }
    >
      <View as="div" padding="small" maxWidth="20rem">
        <Text as="div" weight="bold" margin="0 0 x-small 0">
          {I18n.t('Push Forward Time')}
        </Text>
        <Text as="div" size="small" margin="0 0 small 0">
          {I18n.t(
            'When enabled, items due before this time appear on the previous day in List View.',
          )}
        </Text>
        <Checkbox
          label={I18n.t('Enable push forward time')}
          variant="toggle"
          checked={enabled}
          disabled={saving}
          onChange={handleEnabledChange}
          data-testid="push-forward-time-enabled-toggle"
        />
        <View as="div" margin="small 0 0 0">
          <SimpleSelect
            renderLabel={
              <ScreenReaderContent>{I18n.t('Push forward time hour')}</ScreenReaderContent>
            }
            assistiveText={I18n.t('Push forward time hour')}
            value={String(hour)}
            disabled={!enabled || saving}
            onChange={handleHourChange}
            data-testid="push-forward-time-hour-select"
          >
            {hourOptions.map(option => (
              <SimpleSelect.Option key={option.value} id={String(option.value)} value={option.value}>
                {option.label}
              </SimpleSelect.Option>
            ))}
          </SimpleSelect>
        </View>
      </View>
    </Popover>
  )
}

PushForwardTimeSettings.propTypes = {
  locale: PropTypes.string,
  onApplied: PropTypes.func,
}

PushForwardTimeSettings.defaultProps = {
  locale: 'en',
  onApplied: () => {},
}
