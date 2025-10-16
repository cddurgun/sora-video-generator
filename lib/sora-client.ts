const SORA_API_ENDPOINT = 'https://api.openai.com/v1/video/generations'

export interface GenerateVideoRequest {
  prompt: string
  orientation?: 'landscape' | 'portrait' | 'square'
  duration?: 5 | 10 | 20
  quality?: 'standard' | 'high'
  model?: 'sora-2' | 'sora-2-pro'
}

export interface VideoGenerationResponse {
  id: string
  created: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  model: string
  prompt: string
  duration?: number
}

export interface VideoStatusResponse {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  data?: {
    url: string
  }[]
  error?: {
    message: string
    code: string
  }
}

export class SoraClient {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async generateVideo(request: GenerateVideoRequest): Promise<VideoGenerationResponse> {
    const response = await fetch(SORA_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: request.model || 'sora-2',
        prompt: request.prompt,
        orientation: request.orientation || 'landscape',
        duration: request.duration || 5,
        quality: request.quality || 'standard',
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(
        error.error?.message || `API Error: ${response.status}`
      )
    }

    return response.json()
  }

  async getVideoStatus(videoId: string): Promise<VideoStatusResponse> {
    const response = await fetch(`${SORA_API_ENDPOINT}/${videoId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(
        error.error?.message || `API Error: ${response.status}`
      )
    }

    return response.json()
  }
}

// Utility function to validate API key format
export function isValidApiKey(key: string): boolean {
  return key.length > 0 && key.startsWith('sk-')
}
