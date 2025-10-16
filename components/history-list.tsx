'use client'

import { } from 'react'
import { StorageManager, GenerationRecord } from '@/lib/storage'

interface HistoryListProps {
  limit?: number
}

export default function HistoryList({ limit = 10 }: HistoryListProps) {
  const isClient = typeof window !== 'undefined'

  const history = isClient ? StorageManager.getGenerationHistory().slice(0, limit) : []

  if (!isClient) {
    return <div className="text-center py-8 text-neutral-500">Loading history...</div>
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-500">No videos generated yet</p>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      completed: 'bg-emerald-100 text-emerald-700',
      processing: 'bg-neutral-200 text-neutral-800',
      pending: 'bg-neutral-100 text-neutral-600',
      failed: 'bg-rose-100 text-rose-700',
    }
    return badges[status] || badges['pending']
  }

  return (
    <div className="space-y-3">
      {history.map((record) => (
        <div key={record.id} className="card p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <p className="font-medium text-neutral-900 text-sm line-clamp-2">
                {record.prompt}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                {new Date(record.createdAt).toLocaleString()}
              </p>
            </div>
            <span
              className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ml-2 ${getStatusBadge(
                record.status
              )}`}
            >
              {record.status}
            </span>
          </div>

          {record.videoUrl && (
            <div className="mb-3">
              <video
                className="w-full h-24 object-cover rounded bg-black"
                src={record.videoUrl}
              />
            </div>
          )}

          {record.error && (
            <p className="text-xs text-red-600 mb-2">Error: {record.error}</p>
          )}

          <div className="flex gap-2 text-xs">
            {record.model && (
              <span className="px-2 py-1 bg-neutral-100 rounded text-neutral-700">
                {record.model === 'sora-2-pro' ? 'Pro' : 'Standard'}
              </span>
            )}
            {record.orientation && (
              <span className="px-2 py-1 bg-neutral-100 rounded text-neutral-700">
                {record.orientation}
              </span>
            )}
            {record.duration && (
              <span className="px-2 py-1 bg-neutral-100 rounded text-neutral-700">
                {record.duration}s
              </span>
            )}
            {record.quality && (
              <span className="px-2 py-1 bg-neutral-100 rounded text-neutral-700">
                {record.quality}
              </span>
            )}
          </div>

          {record.videoUrl && (
            <a
              href={record.videoUrl}
              download={`video_${record.id}.mp4`}
              className="inline-block mt-3 btn-primary text-xs px-3 py-1"
            >
              Download
            </a>
          )}
        </div>
      ))}
    </div>
  )
}
