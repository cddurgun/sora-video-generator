'use client'

import { useState, useEffect } from 'react'
import { StorageManager, FavoritePrompt } from '@/lib/storage'

interface FavoritesPanelProps {
  onSelectFavorite?: (favorite: FavoritePrompt) => void
}

export default function FavoritesPanel({ onSelectFavorite }: FavoritesPanelProps) {
  const [favorites, setFavorites] = useState<FavoritePrompt[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fav = StorageManager.getFavorites()
    setFavorites(fav)
    setLoading(false)
  }, [])

  const handleRemove = (id: string) => {
    StorageManager.removeFavorite(id)
    setFavorites(StorageManager.getFavorites())
  }

  if (loading) {
    return <div className="text-center py-4 text-slate-500">Loading favorites...</div>
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500 text-sm">No favorite prompts yet</p>
        <p className="text-slate-400 text-xs mt-2">Save your favorite prompts to access them quickly</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {favorites.map(favorite => (
        <div
          key={favorite.id}
          className="card p-4 hover:border-blue-400 transition-all"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h4 className="font-semibold text-slate-900">{favorite.name}</h4>
              <p className="text-xs text-slate-500 mt-1">
                {favorite.duration}s • {favorite.orientation} • {favorite.quality}
              </p>
            </div>
            <button
              onClick={() => handleRemove(favorite.id)}
              className="text-slate-400 hover:text-red-600 transition-colors ml-2"
              title="Remove from favorites"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-slate-600 line-clamp-2 mb-3">{favorite.prompt}</p>
          <button
            onClick={() => onSelectFavorite?.(favorite)}
            className="w-full py-2 text-sm font-medium bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
          >
            Use This Prompt
          </button>
        </div>
      ))}
    </div>
  )
}
