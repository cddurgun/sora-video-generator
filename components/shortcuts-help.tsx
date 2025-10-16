'use client'

import { useState } from 'react'

const SHORTCUTS = [
  {
    keys: ['Ctrl', 'Enter'],
    description: 'Generate video',
    mac: ['Cmd', 'Enter'],
  },
  {
    keys: ['Ctrl', 'K'],
    description: 'Focus on prompt field',
    mac: ['Cmd', 'K'],
  },
  {
    keys: ['Ctrl', 'Backspace'],
    description: 'Clear prompt',
    mac: ['Cmd', 'Backspace'],
  },
]

export default function ShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      {/* Help Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-ghost px-3 py-2 text-sm"
      >
        ⌨️ Keyboard Shortcuts
      </button>

      {/* Shortcuts Modal */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-slide-up">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Keyboard Shortcuts</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                {SHORTCUTS.map((shortcut, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-700 flex-1">{shortcut.description}</p>
                    <div className="flex gap-1">
                      {shortcut.keys.map((key, i) => (
                        <span key={i}>
                          <kbd className="px-2 py-1 text-xs font-medium bg-white border border-slate-200 rounded text-slate-700">
                            {key}
                          </kbd>
                          {i < shortcut.keys.length - 1 && <span className="mx-1 text-slate-400">+</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-slate-500 mt-4">
                On Mac, use Cmd instead of Ctrl
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
