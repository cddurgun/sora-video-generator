'use client'

import { } from 'react'
import { StorageManager } from '@/lib/storage'

interface AnalyticsData {
  totalGenerated: number
  successfulGenerations: number
  failedGenerations: number
  successRate: number
  totalFavorites: number
  averageGenerationTime: number
  mostUsedDuration: 5 | 10 | 20
  mostUsedQuality: 'standard' | 'high'
  mostUsedOrientation: 'landscape' | 'portrait' | 'square'
}

function StatCard({ label, value, unit = '' }: { label: string; value: string | number; unit?: string }) {
  return (
    <div className="card p-4">
      <p className="text-xs text-neutral-500 mb-2">{label}</p>
      <p className="text-2xl font-bold text-neutral-900">
        {value}
        {unit && <span className="text-lg text-neutral-600 ml-1">{unit}</span>}
      </p>
    </div>
  )
}

function computeAnalytics(): AnalyticsData | null {
  if (typeof window === 'undefined') return null

  const history = StorageManager.getGenerationHistory()
  const favorites = StorageManager.getFavorites()

    if (history.length === 0) {
      return {
        totalGenerated: 0,
        successfulGenerations: 0,
        failedGenerations: 0,
        successRate: 0,
        totalFavorites: favorites.length,
        averageGenerationTime: 0,
        mostUsedDuration: 5,
        mostUsedQuality: 'standard',
        mostUsedOrientation: 'landscape',
      }
    }

    const successful = history.filter((h) => h.status === 'completed').length
    const failed = history.filter((h) => h.status === 'failed').length

    const completedItems = history.filter((h) => h.status === 'completed' && h.completedAt)
    const totalTime = completedItems.reduce((sum, item) => {
      if (item.completedAt) {
        return sum + (item.completedAt - item.createdAt) / 1000
      }
      return sum
    }, 0)
    const avgTime = completedItems.length > 0 ? Math.round(totalTime / completedItems.length) : 0

    const durations = history.map((h) => h.duration || 5) as (5 | 10 | 20)[]
    const qualities = history.map((h) => h.quality || 'standard') as ('standard' | 'high')[]
    const orientations = history.map((h) => h.orientation || 'landscape') as ('landscape' | 'portrait' | 'square')[]

    const mostFrequent = <T,>(arr: T[]): T => {
      const freq: Record<string, number> = {}
      for (const item of arr) {
        freq[String(item)] = (freq[String(item)] || 0) + 1
      }
      return Object.entries(freq).sort(([, a], [, b]) => b - a)[0][0] as T
    }

  return {
      totalGenerated: history.length,
      successfulGenerations: successful,
      failedGenerations: failed,
      successRate: Math.round((successful / history.length) * 100),
      totalFavorites: favorites.length,
      averageGenerationTime: avgTime,
      mostUsedDuration: mostFrequent(durations),
      mostUsedQuality: mostFrequent(qualities),
      mostUsedOrientation: mostFrequent(orientations),
  }
}

export default function AnalyticsDashboard() {
  const isClient = typeof window !== 'undefined'
  const analytics = computeAnalytics()

  if (!isClient) {
    return <div className="text-center py-8 text-neutral-500">Loading analytics...</div>
  }

  if (!analytics || analytics.totalGenerated === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-500">No generation data yet</p>
        <p className="text-neutral-400 text-sm mt-2">Start generating videos to see analytics</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main Metrics */}
      <div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard label="Total Videos Generated" value={analytics.totalGenerated} />
          <StatCard label="Success Rate" value={analytics.successRate} unit="%" />
          <StatCard label="Successful Generations" value={analytics.successfulGenerations} />
          <StatCard label="Failed Generations" value={analytics.failedGenerations} />
        </div>
      </div>

      {/* Time Metrics */}
      <div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard label="Average Generation Time" value={analytics.averageGenerationTime} unit="sec" />
          <StatCard label="Saved Favorites" value={analytics.totalFavorites} />
        </div>
      </div>

      {/* Settings Preferences */}
      <div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Your Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-4">
            <p className="text-xs text-neutral-500 mb-2">Most Used Duration</p>
            <p className="text-2xl font-bold text-neutral-900">{analytics.mostUsedDuration}s</p>
          </div>
          <div className="card p-4">
            <p className="text-xs text-neutral-500 mb-2">Preferred Quality</p>
            <p className="text-2xl font-bold text-neutral-900 capitalize">{analytics.mostUsedQuality}</p>
          </div>
          <div className="card p-4">
            <p className="text-xs text-neutral-500 mb-2">Favorite Orientation</p>
            <p className="text-2xl font-bold text-neutral-900 capitalize">{analytics.mostUsedOrientation}</p>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="card p-4 bg-gradient-to-r from-neutral-100 to-neutral-50">
        <h4 className="font-semibold text-neutral-900 mb-3">Quick Insights</h4>
        <ul className="space-y-2 text-sm text-neutral-700">
          <li>
            ✓ You have successfully generated <strong>{analytics.successfulGenerations}</strong> videos
          </li>
          <li>
            ✓ Your average generation time is <strong>{analytics.averageGenerationTime} seconds</strong>
          </li>
          <li>
            ✓ You have <strong>{analytics.totalFavorites}</strong> favorite prompts saved
          </li>
          <li>
            ✓ You prefer <strong>{analytics.mostUsedDuration}s</strong> videos in{' '}
            <strong>{analytics.mostUsedOrientation}</strong> orientation
          </li>
        </ul>
      </div>
    </div>
  )
}
