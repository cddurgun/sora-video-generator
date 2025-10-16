'use client'

import { useState, useEffect } from 'react'

interface ProgressIndicatorProps {
  status: 'pending' | 'processing' | 'completed' | 'failed'
  elapsedTime: number
  onCancel?: () => void
}

export default function ProgressIndicator({
  status,
  elapsedTime,
  onCancel,
}: ProgressIndicatorProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Different estimations for different statuses
    const estimatedTime = status === 'pending' ? 120 : 90

    // Smooth progress curve - slower at start, faster in middle, slower at end
    const percentage = Math.min((elapsedTime / estimatedTime) * 100, 90)
    setProgress(percentage)
  }, [elapsedTime, status])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const statusConfig = {
    pending: {
      label: 'Initializing',
      color: 'bg-slate-400',
      icon: '⏳',
    },
    processing: {
      label: 'Processing',
      color: 'bg-blue-600',
      icon: '⚡',
    },
    completed: {
      label: 'Complete',
      color: 'bg-green-600',
      icon: '✓',
    },
    failed: {
      label: 'Failed',
      color: 'bg-red-600',
      icon: '✕',
    },
  }

  const config = statusConfig[status]
  const estimatedTotal = status === 'pending' ? 120 : 90

  return (
    <div className="space-y-4">
      {/* Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${config.color} animate-pulse`}></div>
          <span className="text-sm font-medium text-slate-700">{config.label}</span>
        </div>
        <span className="text-xs font-mono text-slate-500">
          {formatTime(elapsedTime)} / {formatTime(estimatedTotal)}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        {/* Background bar */}
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          {/* Progress fill */}
          <div
            className={`h-full ${config.color} transition-all duration-500 ease-out rounded-full`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Optional animated shimmer effect */}
        {(status === 'pending' || status === 'processing') && (
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div
              className="h-full w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"
              style={{
                backgroundSize: '200% 100%',
              }}
            />
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-50 p-3 rounded-lg">
          <p className="text-xs text-slate-500 mb-1">Elapsed</p>
          <p className="text-sm font-semibold text-slate-900">{formatTime(elapsedTime)}</p>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg">
          <p className="text-xs text-slate-500 mb-1">Progress</p>
          <p className="text-sm font-semibold text-slate-900">{Math.floor(progress)}%</p>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg">
          <p className="text-xs text-slate-500 mb-1">ETA</p>
          <p className="text-sm font-semibold text-slate-900">
            {formatTime(Math.max(0, estimatedTotal - elapsedTime))}
          </p>
        </div>
      </div>

      {/* Cancel button for processing state */}
      {(status === 'pending' || status === 'processing') && onCancel && (
        <button
          onClick={onCancel}
          className="w-full py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
        >
          Cancel Generation
        </button>
      )}

      {/* Status Messages */}
      {status === 'completed' && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700 font-medium">Video generated successfully!</p>
        </div>
      )}

      {status === 'failed' && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 font-medium">Generation failed. Please try again.</p>
        </div>
      )}
    </div>
  )
}
