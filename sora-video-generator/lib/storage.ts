export interface GenerationRecord {
  id: string
  prompt: string
  videoUrl?: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  error?: string
  createdAt: number
  completedAt?: number
  duration?: number
  orientation?: string
  quality?: string
}

const STORAGE_KEY = 'sora_generations'
const API_KEY_STORAGE = 'sora_api_key'
const MAX_HISTORY = 50

export class StorageManager {
  static getApiKey(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(API_KEY_STORAGE) || null
  }

  static setApiKey(key: string): void {
    if (typeof window === 'undefined') return
    if (key) {
      localStorage.setItem(API_KEY_STORAGE, key)
    } else {
      localStorage.removeItem(API_KEY_STORAGE)
    }
  }

  static getGenerationHistory(): GenerationRecord[] {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []
    try {
      return JSON.parse(data)
    } catch {
      return []
    }
  }

  static addGeneration(record: GenerationRecord): void {
    if (typeof window === 'undefined') return
    const history = this.getGenerationHistory()
    history.unshift(record)

    // Keep only the last MAX_HISTORY records
    if (history.length > MAX_HISTORY) {
      history.splice(MAX_HISTORY)
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  }

  static updateGeneration(id: string, updates: Partial<GenerationRecord>): void {
    if (typeof window === 'undefined') return
    const history = this.getGenerationHistory()
    const index = history.findIndex((r) => r.id === id)

    if (index !== -1) {
      history[index] = { ...history[index], ...updates }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    }
  }

  static getGeneration(id: string): GenerationRecord | null {
    const history = this.getGenerationHistory()
    return history.find((r) => r.id === id) || null
  }

  static deleteGeneration(id: string): void {
    if (typeof window === 'undefined') return
    const history = this.getGenerationHistory()
    const filtered = history.filter((r) => r.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  }

  static clearHistory(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_KEY)
  }

  static generateId(): string {
    return `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}
