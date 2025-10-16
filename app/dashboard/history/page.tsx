import HistoryList from '@/components/history-list'

export default function HistoryPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Generation History</h1>
        <p className="text-neutral-500 mt-2">View all your generated videos</p>
      </div>

      <HistoryList limit={50} />
    </div>
  )
}
