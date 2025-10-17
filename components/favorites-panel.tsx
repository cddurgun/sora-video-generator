'use client'

import { startTransition, useEffect, useState } from 'react'
import { StorageManager, FavoritePrompt } from '@/lib/storage'

interface FavoritesPanelProps {
  onSelectFavorite?: (favorite: FavoritePrompt) => void
}

export default function FavoritesPanel({ onSelectFavorite }: FavoritesPanelProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [revision, setRevision] = useState(0)

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      startTransition(() => setIsMounted(true))
    })

    return () => cancelAnimationFrame(raf)
  }, [])

  const favorites = isMounted ? StorageManager.getFavorites() : []

  const handleRemove = (id: string) => {
    StorageManager.removeFavorite(id)
    setRevision((prev) => prev + 1)
  }

  if (!isMounted) {
    return <div className="text-center py-4 text-neutral-500">Loading favorites...</div>
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-500 text-sm">No favorite prompts yet</p>
        <p className="text-neutral-400 text-xs mt-2">Save your favorite prompts to access them quickly</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {favorites.map(favorite => (
        <div
          key={favorite.id}
          className="card p-4 hover:border-neutral-400 transition-all"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h4 className="font-semibold text-neutral-900">{favorite.name}</h4>
              <p className="text-xs text-neutral-500 mt-1">
                {favorite.duration}s • {favorite.orientation} • {favorite.quality}
              </p>
            </div>
            <button
              onClick={() => handleRemove(favorite.id)}
              className="text-neutral-400 hover:text-red-600 transition-colors ml-2"
              title="Remove from favorites"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-neutral-600 line-clamp-2 mb-3">{favorite.prompt}</p>
          <button
            onClick={() => onSelectFavorite?.(favorite)}
            className="w-full py-2 text-sm font-medium bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Use This Prompt
          </button>
        </div>
      ))}
    </div>
  )
}
