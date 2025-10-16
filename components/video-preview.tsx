'use client'

import { useState, useEffect } from 'react'
import { StorageManager, GenerationRecord } from '@/lib/storage'

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

    let pollCount = 0
    const maxPolls = 120 // 10 minutes with 5-second intervals

    const pollStatus = async () => {
      try {
        const response = await fetch(`/api/status?videoId=${videoId}&apiKey=${apiKey}`)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to get video status')
        }

        const data = await response.json()

        setStatus(data.status)

        if (data.status === 'completed' && data.videoUrl) {
          setVideoUrl(data.videoUrl)
          StorageManager.updateGeneration(videoId, {
            status: 'completed',
            videoUrl: data.videoUrl,
            completedAt: Date.now(),
          })
          setIsPolling(false)
          onComplete?.(data.videoUrl)
        } else if (data.status === 'failed') {
          const errorMessage = data.error?.message || 'Video generation failed'
          setError(errorMessage)
          StorageManager.updateGeneration(videoId, {
            status: 'failed',
            error: errorMessage,
          })
          setIsPolling(false)
          onError?.(errorMessage)
        } else if (pollCount >= maxPolls) {
          const timeoutError = 'Video generation timed out'
          setError(timeoutError)
          StorageManager.updateGeneration(videoId, {
            status: 'failed',
            error: timeoutError,
          })
          setIsPolling(false)
          onError?.(timeoutError)
        }

        pollCount++
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred'
        setError(errorMessage)
        StorageManager.updateGeneration(videoId, {
          status: 'failed',
          error: errorMessage,
        })
        setIsPolling(false)
        onError?.(errorMessage)
      }
    }

    // Initial status check
    pollStatus()

    // Set up polling interval
    const interval = setInterval(pollStatus, 5000) // Poll every 5 seconds

    return () => clearInterval(interval)
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
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Video Generation Status</h3>

      {/* Status Indicator */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-4 h-4 rounded-full ${
              status === 'completed'
                ? 'bg-green-500'
                : status === 'failed'
                  ? 'bg-red-500'
                  : 'bg-blue-500 animate-pulse'
            }`}
          />
          <span className="font-medium text-gray-900 capitalize">{status}</span>
        </div>

        {/* Progress bar */}
        {(status === 'processing' || status === 'pending') && (
          <div className="space-y-2">
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-1000"
                style={{
                  width: `${Math.min((elapsedTime / estimatedTime) * 100, 90)}%`,
                }}
              />
            </div>
            <p className="text-xs text-gray-600">
              Elapsed: {formatTime(elapsedTime)} / Est. {formatTime(estimatedTime)}s
            </p>
          </div>
        )}
      </div>

      {/* Video Display */}
      {videoUrl && (
        <div className="mb-6">
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
            className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium w-full"
          >
            ↓ Download Video
          </button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Video ID */}
      <div className="text-xs text-gray-500 mt-4 p-2 bg-gray-50 rounded">
        Video ID: <span className="font-mono">{videoId}</span>
      </div>
    </div>
  )
}
