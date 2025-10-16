import { NextRequest, NextResponse } from 'next/server'
import { SoraClient } from '@/lib/sora-client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const videoId = searchParams.get('videoId')
    const apiKey = searchParams.get('apiKey')

    // Validate required fields
    if (!videoId || !apiKey) {
      return NextResponse.json(
        { error: 'Missing required query parameters: videoId and apiKey' },
        { status: 400 }
      )
    }

    // Initialize Sora client with the provided API key
    const sora = new SoraClient(apiKey)

    // Get video status
    const response = await sora.getVideoStatus(videoId)

    return NextResponse.json({
      id: response.id,
      status: response.status,
      videoUrl: response.data?.[0]?.url,
      error: response.error,
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { videoId, apiKey } = body

    // Validate required fields
    if (!videoId || !apiKey) {
      return NextResponse.json(
        { error: 'Missing required fields: videoId and apiKey' },
        { status: 400 }
      )
    }

    // Initialize Sora client with the provided API key
    const sora = new SoraClient(apiKey)

    // Get video status
    const response = await sora.getVideoStatus(videoId)

    return NextResponse.json({
      id: response.id,
      status: response.status,
      videoUrl: response.data?.[0]?.url,
      error: response.error,
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
