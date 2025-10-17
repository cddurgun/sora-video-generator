'use client'

import { createContext, useContext, useEffect, useState, useCallback, startTransition } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  const applyTheme = useCallback((newTheme: Theme) => {
    const root = document.documentElement
    if (newTheme === 'dark') {
      root.classList.add('dark')
      root.style.colorScheme = 'dark'
    } else {
      root.classList.remove('dark')
      root.style.colorScheme = 'light'
    }
    localStorage.setItem('sora_theme', newTheme)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem('sora_theme') as Theme | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme = stored || (prefersDark ? 'dark' : 'light')

    const raf = requestAnimationFrame(() => {
      startTransition(() => {
        setTheme((current) => (current === initialTheme ? current : initialTheme))
      })
    })

    return () => cancelAnimationFrame(raf)
  }, [])

  // Apply theme whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined') return
    applyTheme(theme)
  }, [applyTheme, theme])

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const nextTheme = current === 'light' ? 'dark' : 'light'
      applyTheme(nextTheme)
      return nextTheme
    })
  }, [applyTheme])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    return { theme: 'light' as Theme, toggleTheme: () => {} }
  }
  return context
}
