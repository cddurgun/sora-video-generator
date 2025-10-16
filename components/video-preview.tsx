'use client'

import { useState, useEffect } from 'react'
import { StorageManager, GenerationRecord } from '@/lib/storage'
import ProgressIndicator from './progress-indicator'

interface VideoPreviewProps {
  videoId: string
  onComplete?: (url: string) => void
  onError?: (error: string) => void
}

export default function VideoPreview({
  videoId,
  onComplete,
  onError,
}: VideoPreviewProps) {
  const [status, setStatus] = useState<'pending' | 'processing' | 'completed' | 'failed'>(
    'processing'
  )
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isPolling, setIsPolling] = useState(true)

  useEffect(() => {
    const apiKey = StorageManager.getApiKey()
    if (!apiKey) {
      const err = 'API key not found'
      setError(err)
      onError?.(err)
      setIsPolling(false)
      return
    }

    setStatus('processing')
    setVideoUrl(null)
    setError(null)
    setElapsedTime(0)
    setIsPolling(true)

    let pollCount = 0
    const maxPolls = 120 // 10 minutes with 5-second intervals
    let intervalId: ReturnType<typeof setInterval> | null = null
    let controller: AbortController | null = null
    let isActive = true

    const stopPolling = () => {
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
      if (controller) {
        controller.abort()
        controller = null
      }
      if (isActive) {
        setIsPolling(false)
      }
    }

    const handleFailure = (message: string) => {
      if (!isActive) return
      setError(message)
      StorageManager.updateGeneration(videoId, {
        status: 'failed',
        error: message,
      })
      stopPolling()
      onError?.(message)
    }

    const pollStatus = async () => {
      if (!isActive) return

      try {
        controller?.abort()
        controller = new AbortController()

        const response = await fetch(`/api/status?videoId=${videoId}&apiKey=${apiKey}`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to get video status')
        }

        const data = await response.json()
        if (!isActive) return

        setStatus(data.status)

        if (data.status === 'completed' && data.videoUrl) {
          setVideoUrl(data.videoUrl)
          StorageManager.updateGeneration(videoId, {
            status: 'completed',
            videoUrl: data.videoUrl,
            completedAt: Date.now(),
          })
          stopPolling()
          onComplete?.(data.videoUrl)
          return
        }

        if (data.status === 'failed') {
          const errorMessage = data.error?.message || 'Video generation failed'
          handleFailure(errorMessage)
          return
        }

        StorageManager.updateGeneration(videoId, {
          status: data.status,
        })

        if (pollCount >= maxPolls) {
          handleFailure('Video generation timed out')
          return
        }

        pollCount++
      } catch (err) {
        if (!isActive) return
        if (err instanceof DOMException && err.name === 'AbortError') {
          return
        }
        const errorMessage = err instanceof Error ? err.message : 'An error occurred'
        handleFailure(errorMessage)
      }
    }

    // Initial status check
    pollStatus()

    // Set up polling interval
    intervalId = setInterval(pollStatus, 5000) // Poll every 5 seconds

    return () => {
      isActive = false
      if (intervalId) {
        clearInterval(intervalId)
      }
      controller?.abort()
    }
  }, [videoId, onComplete, onError])

  // Update elapsed time
  useEffect(() => {
    if (!isPolling) return

    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [isPolling])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const estimatedTime = status === 'pending' ? 120 : 90 // Different estimates for pending vs processing

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-neutral-900 mb-6">Generation Status</h3>

      {/* Advanced Progress Indicator */}
      <div className="mb-6">
        <ProgressIndicator
          status={status}
          elapsedTime={elapsedTime}
          onCancel={() => {
            // Could add cancellation logic here in the future
          }}
        />
      </div>

      {/* Video Display */}
      {videoUrl && (
        <div className="mb-6 space-y-3">
          <video
            controls
            className="w-full rounded-lg bg-black aspect-video"
            src={videoUrl}
          />
          <button
            onClick={() => {
              const a = document.createElement('a')
              a.href = videoUrl
              a.download = `video_${videoId}.mp4`
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
            }}
            className="w-full btn-primary"
          >
            Download Video
          </button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
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

      {/* Video ID & Debug Info */}
      <div className="p-3 bg-neutral-100 border border-neutral-200 rounded-lg">
        <p className="text-xs text-neutral-500">
          ID: <span className="font-mono text-neutral-600">{videoId.substring(0, 20)}...</span>
        </p>
      </div>
    </div>
  )
}
