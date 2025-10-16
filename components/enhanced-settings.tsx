'use client'

import { useState } from 'react'
import { StorageManager } from '@/lib/storage'

export interface UserPreferences {
  autoSavePrompts: boolean
  defaultDuration: 5 | 10 | 20
  defaultQuality: 'standard' | 'high'
  defaultOrientation: 'landscape' | 'portrait' | 'square'
  notificationsEnabled: boolean
  darkMode: boolean
  showTips: boolean
}

const DEFAULT_PREFERENCES: UserPreferences = {
  autoSavePrompts: true,
  defaultDuration: 5,
  defaultQuality: 'standard',
  defaultOrientation: 'landscape',
  notificationsEnabled: true,
  darkMode: false,
  showTips: true,
}

const PREFS_KEY = 'sora_preferences'

export function getUserPreferences(): UserPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES
  const stored = localStorage.getItem(PREFS_KEY)
  if (!stored) return DEFAULT_PREFERENCES
  try {
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) }
  } catch {
    return DEFAULT_PREFERENCES
  }
}

export function saveUserPreferences(prefs: UserPreferences) {
  if (typeof window === 'undefined') return
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
}

export default function EnhancedSettings() {
  const [prefs, setPrefs] = useState<UserPreferences>(
    typeof window !== 'undefined' ? getUserPreferences() : DEFAULT_PREFERENCES
  )
  const [loading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleChange = (key: keyof UserPreferences, value: any) => {
    const updated = { ...prefs, [key]: value }
    setPrefs(updated)
    saveUserPreferences(updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    if (confirm('Reset all settings to defaults?')) {
      setPrefs(DEFAULT_PREFERENCES)
      saveUserPreferences(DEFAULT_PREFERENCES)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const handleClearData = () => {
    if (confirm('This will delete all favorites and generation history. Continue?')) {
      StorageManager.clearHistory()
      StorageManager.clearFavorites()
      alert('All data cleared')
    }
  }

  if (loading) {
    return <div className="text-center py-4 text-neutral-500">Loading preferences...</div>
  }

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <section>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">General Preferences</h3>
        <div className="card p-6 space-y-4">
          {/* Auto-save prompts */}
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-neutral-900">Auto-save Prompts</label>
              <p className="text-xs text-neutral-500 mt-1">Automatically save prompts as favorites</p>
            </div>
            <input
              type="checkbox"
              checked={prefs.autoSavePrompts}
              onChange={(e) => handleChange('autoSavePrompts', e.target.checked)}
              className="w-5 h-5 rounded border-neutral-300 cursor-pointer"
            />
          </div>

          {/* Show Tips */}
          <div className="divider"></div>
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-neutral-900">Show Tips</label>
              <p className="text-xs text-neutral-500 mt-1">Display helpful tips throughout the app</p>
            </div>
            <input
              type="checkbox"
              checked={prefs.showTips}
              onChange={(e) => handleChange('showTips', e.target.checked)}
              className="w-5 h-5 rounded border-neutral-300 cursor-pointer"
            />
          </div>

          {/* Notifications */}
          <div className="divider"></div>
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-neutral-900">Notifications</label>
              <p className="text-xs text-neutral-500 mt-1">Browser notifications when videos complete</p>
            </div>
            <input
              type="checkbox"
              checked={prefs.notificationsEnabled}
              onChange={(e) => handleChange('notificationsEnabled', e.target.checked)}
              className="w-5 h-5 rounded border-neutral-300 cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* Default Generation Settings */}
      <section>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Default Generation Settings</h3>
        <div className="card p-6 space-y-4">
          {/* Default Duration */}
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Default Duration
            </label>
            <select
              value={prefs.defaultDuration}
              onChange={(e) => handleChange('defaultDuration', Number(e.target.value) as any)}
              className="input-field"
            >
              <option value={5}>5 seconds</option>
              <option value={10}>10 seconds</option>
              <option value={20}>20 seconds</option>
            </select>
          </div>

          {/* Default Quality */}
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Default Quality
            </label>
            <select
              value={prefs.defaultQuality}
              onChange={(e) => handleChange('defaultQuality', e.target.value as any)}
              className="input-field"
            >
              <option value="standard">Standard</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Default Orientation */}
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Default Orientation
            </label>
            <select
              value={prefs.defaultOrientation}
              onChange={(e) => handleChange('defaultOrientation', e.target.value as any)}
              className="input-field"
            >
              <option value="landscape">Landscape (16:9)</option>
              <option value="portrait">Portrait (9:16)</option>
              <option value="square">Square (1:1)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Data Management */}
      <section>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Data Management</h3>
        <div className="card p-6 space-y-3">
          <button
            onClick={handleReset}
            className="w-full py-2 px-4 bg-neutral-200 text-neutral-900 rounded-lg hover:bg-neutral-300 transition-colors font-medium"
          >
            Reset All Settings to Default
          </button>
          <button
            onClick={handleClearData}
            className="w-full py-2 px-4 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
          >
            Clear All Data (Favorites & History)
          </button>
        </div>
      </section>

      {/* Save Indicator */}
      {saved && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700 font-medium">✓ Settings saved</p>
        </div>
      )}

      {/* Info */}
      <div className="p-4 bg-neutral-100 border border-neutral-200 rounded-lg">
        <p className="text-xs text-neutral-600">
          Your preferences are saved locally in your browser and never sent to any server.
        </p>
      </div>
    </div>
  )
}
