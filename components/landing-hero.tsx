'use client'

import Link from 'next/link'

export default function LandingHero() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="mb-8 inline-block">
          <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
            ✨ Powered by Sora 2 AI
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6">
          Create Amazing Videos
          <span className="block text-blue-600">from Text in Seconds</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl text-neutral-600 mb-12 max-w-2xl mx-auto">
          Transform your creative ideas into stunning AI-generated videos. No technical skills required.
          Just describe your vision and let Sora 2 bring it to life.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            href="/signup"
            className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Get Started Free
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 bg-white text-neutral-900 font-semibold rounded-lg border border-neutral-300 hover:bg-neutral-50 transition-colors"
          >
            Sign In
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="text-3xl mb-4">🎥</div>
            <h3 className="font-semibold text-neutral-900 mb-2">Advanced AI Generation</h3>
            <p className="text-neutral-600">
              Leverage the latest Sora 2 model for high-quality video generation
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="font-semibold text-neutral-900 mb-2">Lightning Fast</h3>
            <p className="text-neutral-600">
              Generate videos quickly with optimized processing and instant previews
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="text-3xl mb-4">🎨</div>
            <h3 className="font-semibold text-neutral-900 mb-2">Full Creative Control</h3>
            <p className="text-neutral-600">
              Customize duration, orientation, quality and more with intuitive controls
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-neutral-500 text-sm mt-16">
          Join thousands of creators using Sora Video Generator
        </p>
      </div>
    </div>
  )
}
