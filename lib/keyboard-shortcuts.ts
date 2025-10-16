import { useEffect } from 'react'

type KeyboardHandler = (event: KeyboardEvent) => void

interface KeyboardShortcuts {
  [key: string]: {
    description: string
    handler: KeyboardHandler
  }
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Create a key string from the event
      const keys: string[] = []

      if (event.ctrlKey || event.metaKey) keys.push('cmd')
      if (event.shiftKey) keys.push('shift')
      if (event.altKey) keys.push('alt')

      // Get the actual key pressed
      const key = event.key.toLowerCase()
      if (key !== 'control' && key !== 'meta' && key !== 'shift' && key !== 'alt') {
        keys.push(key)
      }

      const shortcutKey = keys.join('+')

      // Check if this shortcut exists
      if (shortcuts[shortcutKey]) {
        event.preventDefault()
        shortcuts[shortcutKey].handler(event)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [shortcuts])
}

export const SHORTCUT_KEYS = {
  GENERATE: 'cmd+enter',
  CLEAR_PROMPT: 'cmd+backspace',
  FOCUS_PROMPT: 'cmd+k',
} as const

export const SHORTCUT_DESCRIPTIONS = {
  [SHORTCUT_KEYS.GENERATE]: 'Generate video (Ctrl+Enter / Cmd+Enter)',
  [SHORTCUT_KEYS.CLEAR_PROMPT]: 'Clear prompt (Ctrl+Backspace / Cmd+Backspace)',
  [SHORTCUT_KEYS.FOCUS_PROMPT]: 'Focus prompt field (Ctrl+K / Cmd+K)',
} as const
