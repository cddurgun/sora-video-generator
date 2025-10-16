'use client'

import { useState, useRef, forwardRef, useImperativeHandle, useCallback } from 'react'
import { StorageManager } from '@/lib/storage'
import { isValidApiKey } from '@/lib/sora-client'
import TemplateGallery from './template-gallery'
import { useKeyboardShortcuts, SHORTCUT_KEYS, SHORTCUT_DESCRIPTIONS } from '@/lib/keyboard-shortcuts'

export interface GeneratedVideoDetails {
  videoId: string
  prompt: string
  orientation: 'landscape' | 'portrait' | 'square'
  duration: 5 | 10 | 20
  quality: 'standard' | 'high'
}

export interface VideoGeneratorHandle {
  prefillFromTemplate: (prompt: string, duration?: 5 | 10 | 20) => void
}

interface VideoGeneratorProps {
  onGenerate?: (details: GeneratedVideoDetails) => void
  onError?: (error: string) => void
}

const VideoGenerator = forwardRef<VideoGeneratorHandle, VideoGeneratorProps>(function VideoGenerator(
  { onGenerate, onError },
  ref
) {
  const [prompt, setPrompt] = useState('')
  const [orientation, setOrientation] = useState<'landscape' | 'portrait' | 'square'>('landscape')
  const [duration, setDuration] = useState<5 | 10 | 20>(5)
  const [quality, setQuality] = useState<'standard' | 'high'>('standard')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const promptRef = useRef<HTMLTextAreaElement>(null)
  const [isFavorited, setIsFavorited] = useState(false)
  const [showFavoriteName, setShowFavoriteName] = useState(false)
  const [favoriteName, setFavoriteName] = useState('')

  const prefillFromTemplate = useCallback((templatePrompt: string, templateDuration?: 5 | 10 | 20) => {
    setPrompt(templatePrompt)
    if (templateDuration) {
      setDuration(templateDuration)
    }
    setShowFavoriteName(false)
    setFavoriteName('')
    promptRef.current?.focus()
  }, [])

  useImperativeHandle(ref, () => ({
    prefillFromTemplate,
  }), [prefillFromTemplate])

  const handleAddFavorite = () => {
    if (!favoriteName.trim() && !prompt.trim()) return

    StorageManager.addFavorite({
      name: favoriteName || prompt.substring(0, 30) + '...',
      prompt,
      duration,
      orientation,
      quality,
    })

    setIsFavorited(true)
    setShowFavoriteName(false)
    setFavoriteName('')

    setTimeout(() => setIsFavorited(false), 2000)
  }

  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    [SHORTCUT_KEYS.GENERATE]: {
      description: SHORTCUT_DESCRIPTIONS[SHORTCUT_KEYS.GENERATE],
      handler: () => {
        if (formRef.current && !isLoading && prompt.trim()) {
          formRef.current.dispatchEvent(
            new Event('submit', { bubbles: true, cancelable: true })
          )
        }
      },
    },
    [SHORTCUT_KEYS.CLEAR_PROMPT]: {
      description: SHORTCUT_DESCRIPTIONS[SHORTCUT_KEYS.CLEAR_PROMPT],
      handler: () => {
        setPrompt('')
        promptRef.current?.focus()
      },
    },
    [SHORTCUT_KEYS.FOCUS_PROMPT]: {
      description: SHORTCUT_DESCRIPTIONS[SHORTCUT_KEYS.FOCUS_PROMPT],
      handler: () => {
        promptRef.current?.focus()
      },
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const trimmedPrompt = prompt.trim()

    // Validation
    if (!trimmedPrompt) {
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
          prompt: trimmedPrompt,
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
      setShowFavoriteName(false)
      setFavoriteName('')

      onGenerate?.({
        videoId: data.videoId,
        prompt: trimmedPrompt,
        orientation,
        duration,
        quality,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900">Generate Video</h2>
        <p className="text-neutral-500 text-sm mt-1">Create stunning videos from text descriptions</p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        {/* Prompt */}
        <div>
          <label htmlFor="prompt" className="block text-sm font-semibold text-neutral-900 mb-3">
            Video Prompt
            <span className="text-xs text-neutral-500 font-normal ml-2">(Ctrl+K to focus, Ctrl+Enter to generate)</span>
          </label>
          <textarea
            ref={promptRef}
            id="prompt"
            name="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the video you want to generate. Be creative and specific!"
            rows={4}
            className="input-field resize-none"
            disabled={isLoading}
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-neutral-500">
              Describe what you want to see in your video
            </p>
            <p className={`text-xs font-medium ${prompt.length > 450 ? 'text-red-600' : 'text-neutral-400'}`}>
              {prompt.length}/500
            </p>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Orientation */}
          <div>
            <label htmlFor="orientation" className="block text-sm font-semibold text-neutral-900 mb-2">
              Orientation
            </label>
            <select
              id="orientation"
              value={orientation}
              onChange={(e) => setOrientation(e.target.value as any)}
              className="input-field"
              disabled={isLoading}
            >
              <option value="landscape">Landscape (16:9)</option>
              <option value="portrait">Portrait (9:16)</option>
              <option value="square">Square (1:1)</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label htmlFor="duration" className="block text-sm font-semibold text-neutral-900 mb-2">
              Duration
            </label>
            <select
              id="duration"
              name="duration"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value) as any)}
              className="input-field"
              disabled={isLoading}
            >
              <option value={5}>5 seconds</option>
              <option value={10}>10 seconds</option>
              <option value={20}>20 seconds</option>
            </select>
          </div>

          {/* Quality */}
          <div>
            <label htmlFor="quality" className="block text-sm font-semibold text-neutral-900 mb-2">
              Quality
            </label>
            <select
              id="quality"
              value={quality}
              onChange={(e) => setQuality(e.target.value as any)}
              className="input-field"
              disabled={isLoading}
            >
              <option value="standard">Standard</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={() => setShowFavoriteName(!showFavoriteName)}
          disabled={!prompt.trim()}
          className="btn-secondary w-full"
        >
          {isFavorited ? '✓ Added to Favorites' : '★ Save as Favorite'}
        </button>

        {/* Favorite Name Input */}
        {showFavoriteName && (
          <div className="space-y-2 p-4 bg-neutral-100 border border-neutral-200 rounded-lg">
            <label className="block text-sm font-medium text-neutral-900">
              Favorite Name
            </label>
            <input
              type="text"
              value={favoriteName}
              onChange={(e) => setFavoriteName(e.target.value)}
              placeholder={prompt.substring(0, 40) + '...'}
              className="input-field"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAddFavorite}
                className="btn-primary flex-1"
              >
                Save Favorite
              </button>
              <button
                type="button"
                onClick={() => setShowFavoriteName(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg animate-slide-up">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="w-full btn-primary"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Generating Video...
            </span>
          ) : (
            'Generate Video'
          )}
        </button>

        {/* Info */}
        <div className="p-4 bg-neutral-100 border border-neutral-200 rounded-lg">
          <div className="flex gap-3">
            <div className="text-neutral-500 flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm text-neutral-600">
              <strong className="text-neutral-900">Pro tip:</strong> Video generation typically takes 1-2 minutes. Your progress will be tracked in real-time.
            </p>
          </div>
        </div>
      </form>
    </div>
  )
})

VideoGenerator.displayName = 'VideoGenerator'

export default VideoGenerator

// Helper function to add template section
export function VideoGeneratorWithTemplates({
  onGenerate,
  onError,
}: VideoGeneratorProps) {
  const generatorRef = useRef<VideoGeneratorHandle>(null)

  return (
    <div className="space-y-8">
      <div>
        <VideoGenerator ref={generatorRef} onGenerate={onGenerate} onError={onError} />
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Start Templates</h3>
        <p className="text-sm text-neutral-600 mb-4">Choose from pre-crafted prompts to get started quickly</p>
        <TemplateGallery
          onSelectTemplate={(prompt, duration) => {
            generatorRef.current?.prefillFromTemplate(prompt, duration)
          }}
        />
      </div>
    </div>
  )
}
