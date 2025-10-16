'use client'

import { useState, useEffect } from 'react'
import { StorageManager, GenerationRecord } from '@/lib/storage'

interface HistoryListProps {
  limit?: number
}

export default function HistoryList({ limit = 10 }: HistoryListProps) {
  const [history, setHistory] = useState<GenerationRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const records = StorageManager.getGenerationHistory().slice(0, limit)
    setHistory(records)
    setLoading(false)
  }, [limit])

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading history...</div>
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No videos generated yet</p>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      completed: 'bg-green-100 text-green-800',
      processing: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
    }
    return badges[status] || badges['pending']
  }

  return (
    <div className="space-y-3">
      {history.map((record) => (
        <div key={record.id} className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <p className="font-medium text-gray-900 text-sm line-clamp-2">
                {record.prompt}
              </p>
              <p className="text-xs text-gray-500 mt-1">
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
            {record.orientation && (
              <span className="px-2 py-1 bg-gray-100 rounded text-gray-700">
                {record.orientation}
              </span>
            )}
            {record.duration && (
              <span className="px-2 py-1 bg-gray-100 rounded text-gray-700">
                {record.duration}s
              </span>
            )}
            {record.quality && (
              <span className="px-2 py-1 bg-gray-100 rounded text-gray-700">
                {record.quality}
              </span>
            )}
          </div>

          {record.videoUrl && (
            <a
              href={record.videoUrl}
              download={`video_${record.id}.mp4`}
              className="inline-block mt-3 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
            >
              Download
            </a>
          )}
        </div>
      ))}
    </div>
  )
}
