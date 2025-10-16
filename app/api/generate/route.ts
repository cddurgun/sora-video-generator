import { NextRequest, NextResponse } from 'next/server'
import { SoraClient } from '@/lib/sora-client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { prompt, orientation, duration, quality, apiKey, model } = body

    // Validate required fields
    if (!prompt || !apiKey) {
      return NextResponse.json(
        { error: 'Missing required fields: prompt and apiKey' },
        { status: 400 }
      )
    }

    // Validate prompt length
    if (prompt.length > 500) {
      return NextResponse.json(
        { error: 'Prompt must be 500 characters or less' },
        { status: 400 }
      )
    }

    // Initialize Sora client with the provided API key
    const sora = new SoraClient(apiKey)

    // Generate video
    const response = await sora.generateVideo({
      prompt,
      orientation: orientation || 'landscape',
      duration: duration || 5,
      quality: quality || 'standard',
      model: model || 'sora-2',
    })

    // Return video ID for polling
    return NextResponse.json({
      videoId: response.id,
      message: 'Video generation started',
    })
  } catch (error) {
    console.error('API Error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
