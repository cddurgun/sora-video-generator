'use client'

import { useState, useEffect } from 'react'
import { StorageManager } from '@/lib/storage'
import { isValidApiKey } from '@/lib/sora-client'

interface ApiKeyInputProps {
  onSave?: (key: string) => void
}

export default function ApiKeyInput({ onSave }: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const stored = StorageManager.getApiKey()
    if (stored) {
      setApiKey(stored)
    }
  }, [])

  const handleSave = () => {
    if (!apiKey.trim()) {
      setError('API key cannot be empty')
      return
    }

    if (!isValidApiKey(apiKey)) {
      setError('Invalid API key format. Must start with "sk-"')
      return
    }

    StorageManager.setApiKey(apiKey)
    setSaved(true)
    setError('')
    setIsEditing(false)

    if (onSave) {
      onSave(apiKey)
    }

    setTimeout(() => setSaved(false), 3000)
  }

  const handleClear = () => {
    StorageManager.setApiKey('')
    setApiKey('')
    setIsEditing(false)
    setError('')
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">OpenAI API Key</h3>
          <p className="text-sm text-gray-600 mt-1">
            Your API key is stored locally in your browser
          </p>
        </div>
        {!isEditing && apiKey && (
          <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full flex items-center gap-1">
            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            Connected
          </span>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label
              htmlFor="apiKey"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              API Key
            </label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value)
                setError('')
              }}
              placeholder="sk-..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <p className="text-xs text-gray-500 mt-2">
              Get your API key from{' '}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                platform.openai.com/api-keys
              </a>
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Save Key
            </button>
            <button
              onClick={() => {
                setIsEditing(false)
                setError('')
                const stored = StorageManager.getApiKey()
                if (stored) setApiKey(stored)
              }}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-3">
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {apiKey ? 'Update Key' : 'Add Key'}
          </button>
          {apiKey && (
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
            >
              Remove Key
            </button>
          )}
        </div>
      )}

      {saved && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">✓ API key saved successfully</p>
        </div>
      )}
    </div>
  )
}
