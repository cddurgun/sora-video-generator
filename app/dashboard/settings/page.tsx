import ApiKeyInput from '@/components/api-key-input'

export default function SettingsPage() {
  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-2">Configure your API key and preferences</p>
      </div>

      <div className="space-y-8">
        {/* API Key Section */}
        <ApiKeyInput />

        <div className="divider my-8"></div>

        {/* Info Sections */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Security & Privacy</h2>
          <div className="card p-6">
            <ul className="space-y-3">
              <li className="flex gap-3">
                <div className="w-1 h-1 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-slate-600">Your API key is stored securely in your browser&apos;s local storage</p>
              </li>
              <li className="flex gap-3">
                <div className="w-1 h-1 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-slate-600">It is never sent to our servers or any third party</p>
              </li>
              <li className="flex gap-3">
                <div className="w-1 h-1 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-slate-600">Your key is only used to authenticate requests to OpenAI&apos;s API</p>
              </li>
              <li className="flex gap-3">
                <div className="w-1 h-1 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-slate-600">You can clear it anytime from this page</p>
              </li>
            </ul>
          </div>
        </section>

        {/* Pricing Info */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Pricing</h2>
          <div className="card p-6">
            <p className="text-sm text-slate-600 mb-4">
              Sora 2 API usage is charged by OpenAI based on video duration:
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">5-second videos</span>
                <span className="font-medium text-slate-900">$0.02</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">10-second videos</span>
                <span className="font-medium text-slate-900">$0.04</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">20-second videos</span>
                <span className="font-medium text-slate-900">$0.08</span>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              For the most up-to-date pricing, visit{' '}
              <a
                href="https://openai.com/pricing/sora"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                OpenAI&apos;s pricing page
              </a>
            </p>
          </div>
        </section>

        {/* Tips */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Best Practices</h2>
          <div className="card p-6">
            <ul className="space-y-3">
              <li className="flex gap-3">
                <div className="w-1 h-1 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-slate-600">Use clear and detailed prompts for better video generation</p>
              </li>
              <li className="flex gap-3">
                <div className="w-1 h-1 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-slate-600">Be specific about the content, style, and mood you want</p>
              </li>
              <li className="flex gap-3">
                <div className="w-1 h-1 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-slate-600">Longer durations (20s) provide more time for complex scenes</p>
              </li>
              <li className="flex gap-3">
                <div className="w-1 h-1 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-slate-600">High quality videos take longer to generate but look better</p>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
