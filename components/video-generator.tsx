'use client'

import { useState } from 'react'
import { StorageManager } from '@/lib/storage'
import { isValidApiKey } from '@/lib/sora-client'

interface VideoGeneratorProps {
  onGenerate?: (videoId: string) => void
  onError?: (error: string) => void
}

export default function VideoGenerator({
  onGenerate,
  onError,
}: VideoGeneratorProps) {
  const [prompt, setPrompt] = useState('')
  const [orientation, setOrientation] = useState<'landscape' | 'portrait' | 'square'>('landscape')
  const [duration, setDuration] = useState<5 | 10 | 20>(5)
  const [quality, setQuality] = useState<'standard' | 'high'>('standard')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!prompt.trim()) {
      const err = 'Please enter a video prompt'
      setError(err)
      onError?.(err)
      return
    }

    const apiKey = StorageManager.getApiKey()
    if (!apiKey || !isValidApiKey(apiKey)) {
      const err = 'Please add a valid OpenAI API key in Settings'
      setError(err)
      onError?.(err)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          orientation,
          duration,
          quality,
          apiKey,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate video')
      }

      const data = await response.json()

      // Reset form
      setPrompt('')

      onGenerate?.(data.videoId)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Generate Video</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Prompt */}
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
            Video Prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the video you want to generate. Be creative and specific!"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 mt-2">
            {prompt.length}/500 characters
          </p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Orientation */}
          <div>
            <label htmlFor="orientation" className="block text-sm font-medium text-gray-700 mb-2">
              Orientation
            </label>
            <select
              id="orientation"
              value={orientation}
              onChange={(e) => setOrientation(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              disabled={isLoading}
            >
              <option value="landscape">Landscape (16:9)</option>
              <option value="portrait">Portrait (9:16)</option>
              <option value="square">Square (1:1)</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
              Duration
            </label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value) as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              disabled={isLoading}
            >
              <option value={5}>5 seconds</option>
              <option value={10}>10 seconds</option>
              <option value={20}>20 seconds</option>
            </select>
          </div>

          {/* Quality */}
          <div>
            <label htmlFor="quality" className="block text-sm font-medium text-gray-700 mb-2">
              Quality
            </label>
            <select
              id="quality"
              value={quality}
              onChange={(e) => setQuality(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              disabled={isLoading}
            >
              <option value="standard">Standard</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            isLoading || !prompt.trim()
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Generating...
            </span>
          ) : (
            'Generate Video'
          )}
        </button>

        {/* Info */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> Video generation typically takes 1-2 minutes. Your progress will be tracked below.
          </p>
        </div>
      </form>
    </div>
  )
}
