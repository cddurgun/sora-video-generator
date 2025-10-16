import ApiKeyInput from '@/components/api-key-input'

export default function SettingsPage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your application settings and preferences</p>
      </div>

      <div className="space-y-6">
        {/* API Key Section */}
        <ApiKeyInput />

        {/* Info Section */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">About API Keys</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• Your API key is stored securely in your browser's local storage</li>
            <li>• It is never sent to our servers or any third party</li>
            <li>• Your key is only used to authenticate requests to OpenAI's API</li>
            <li>• You can clear it anytime from this page</li>
          </ul>
        </div>

        {/* Pricing Info */}
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <h3 className="font-semibold text-yellow-900 mb-2">Pricing</h3>
          <p className="text-sm text-yellow-800 mb-3">
            Sora 2 API usage is charged by OpenAI based on video duration:
          </p>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• 5-second videos: $0.02</li>
            <li>• 10-second videos: $0.04</li>
            <li>• 20-second videos: $0.08</li>
          </ul>
          <p className="text-xs text-yellow-700 mt-3">
            Check{' '}
            <a
              href="https://openai.com/pricing/sora"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-yellow-900"
            >
              OpenAI's pricing page
            </a>{' '}
            for the most up-to-date pricing information.
          </p>
        </div>

        {/* Tips */}
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <h3 className="font-semibold text-purple-900 mb-2">Tips for Best Results</h3>
          <ul className="text-sm text-purple-800 space-y-2">
            <li>• Use clear and detailed prompts for better video generation</li>
            <li>• Be specific about the content, style, and mood you want</li>
            <li>• Longer durations (20s) provide more time for complex scenes</li>
            <li>• High quality videos take longer to generate</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
