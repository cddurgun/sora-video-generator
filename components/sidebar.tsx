'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import DarkModeToggle from './dark-mode-toggle'

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)

  const navItems = [
    { href: '/dashboard', label: 'Generate' },
    { href: '/dashboard/history', label: 'History' },
    { href: '/dashboard/analytics', label: 'Analytics' },
    { href: '/dashboard/settings', label: 'Settings' },
  ]

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-neutral-50 border border-neutral-300 hover:bg-neutral-100 transition-colors"
        aria-label="Toggle sidebar"
      >
        <svg
          className="w-6 h-6 text-neutral-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed left-0 top-0 h-screen w-64 bg-neutral-50 border-r border-neutral-200 transition-transform duration-200 z-40 md:translate-x-0 md:sticky md:top-0 flex flex-col shadow-sm`}
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-baseline gap-2">
            <h1 className="text-2xl font-bold text-neutral-900">Sora</h1>
            <span className="text-sm font-medium text-neutral-500">2.0</span>
          </div>
          <p className="text-sm text-neutral-500 mt-1">Video Generation Engine</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-2.5 rounded-lg font-medium transition-all ${
                  isActive
                    ? 'bg-neutral-200 text-neutral-900 border-l-2 border-neutral-900 pl-3.5'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 space-y-3">
          <div className="flex justify-center">
            <DarkModeToggle />
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-300 text-center">
            Built with OpenAI Sora 2
          </p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center">
            v1.0.0
          </p>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
