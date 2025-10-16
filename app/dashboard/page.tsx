'use client'

import { useState } from 'react'
import VideoGenerator, { GeneratedVideoDetails } from '@/components/video-generator'
import VideoPreview from '@/components/video-preview'
import HistoryList from '@/components/history-list'
import { StorageManager } from '@/lib/storage'

export default function DashboardPage() {
  const [generatingVideoId, setGeneratingVideoId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const handleGenerate = (details: GeneratedVideoDetails) => {
    // Create a new generation record
    StorageManager.addGeneration({
      id: details.videoId,
      prompt: details.prompt,
      status: 'processing',
      createdAt: Date.now(),
      orientation: details.orientation,
      duration: details.duration,
      quality: details.quality,
    })
    setGeneratingVideoId(details.videoId)
    setError('')
  }

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
  }

  return (
    <div className="max-w-7xl space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Video Generator</h1>
        <p className="text-slate-500 mt-2">
          Create stunning videos from text descriptions using Sora 2
        </p>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Generator and current generation */}
        <div className="lg:col-span-2 space-y-6">
          {/* Generator Form */}
          <VideoGenerator
            onGenerate={handleGenerate}
            onError={handleError}
          />

          {/* Current generation preview */}
          {generatingVideoId && (
            <div className="animate-slide-up">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Generation in Progress
              </h2>
              <VideoPreview
                videoId={generatingVideoId}
                onComplete={() => {
                  // Video completed, can refresh history
                  setGeneratingVideoId(null)
                }}
                onError={handleError}
              />
            </div>
          )}
        </div>

        {/* Right column - Recent history */}
        <div className="card p-6 h-fit sticky top-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Videos</h2>
          <HistoryList limit={5} />
          <a
            href="/dashboard/history"
            className="inline-block mt-4 btn-ghost px-0"
          >
            View All →
          </a>
        </div>
      </div>

      {/* Global error alert */}
      {error && !generatingVideoId && (
        <div className="fixed bottom-4 right-4 max-w-sm p-4 bg-red-50 border border-red-200 rounded-lg shadow-lg animate-slide-up">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={() => setError('')}
                className="mt-2 text-xs text-red-600 hover:text-red-700 font-medium"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
