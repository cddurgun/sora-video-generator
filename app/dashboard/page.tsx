'use client'

import { useState } from 'react'
import VideoGenerator from '@/components/video-generator'
import VideoPreview from '@/components/video-preview'
import HistoryList from '@/components/history-list'
import { StorageManager } from '@/lib/storage'

export default function DashboardPage() {
  const [generatingVideoId, setGeneratingVideoId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const handleGenerate = (videoId: string) => {
    // Create a new generation record
    StorageManager.addGeneration({
      id: videoId,
      prompt: '', // Will be set by the form
      status: 'pending',
      createdAt: Date.now(),
    })
    setGeneratingVideoId(videoId)
    setError('')
  }

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
  }

  return (
    <div className="max-w-6xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Video Generator</h1>
        <p className="text-gray-600 mt-2">
          Create stunning videos using OpenAI Sora 2
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
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Current Generation
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
        <div className="bg-white p-6 rounded-lg border border-gray-200 h-fit">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Videos</h2>
          <HistoryList limit={5} />
          <a
            href="/dashboard/history"
            className="inline-block mt-4 px-4 py-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            View All →
          </a>
        </div>
      </div>

      {/* Global error alert */}
      {error && !generatingVideoId && (
        <div className="fixed bottom-4 right-4 max-w-sm p-4 bg-red-50 border border-red-200 rounded-lg shadow-lg">
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={() => setError('')}
            className="mt-2 text-xs text-red-600 hover:text-red-700"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  )
}
