import AnalyticsDashboard from '@/components/analytics-dashboard'

export default function AnalyticsPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Analytics</h1>
        <p className="text-neutral-500 mt-2">View your video generation statistics and insights</p>
      </div>

      <AnalyticsDashboard />
    </div>
  )
}
