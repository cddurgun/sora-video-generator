# Sora 2 Video Generation Engine

A modern web application for generating videos using OpenAI's Sora 2 API, built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- 🎬 **Text-to-Video Generation** - Generate stunning videos from text prompts
- 📊 **Real-time Status Tracking** - Monitor video generation progress with live polling
- 💾 **Generation History** - Keep track of all your generated videos
- 🔐 **Secure API Key Management** - Store your API key locally in your browser
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- ⚡ **Fast & Lightweight** - Optimized for performance with Vercel deployment

## Quick Start

### Prerequisites

- Node.js 18+ (recommended Node.js 20 LTS)
- npm or yarn
- OpenAI API key with Sora 2 access

### Installation

1. **Clone or download this project:**

```bash
cd sora-video-generator
```

2. **Install dependencies:**

```bash
npm install
```

3. **Run the development server:**

```bash
npm run dev
```

4. **Open in browser:**

Navigate to [http://localhost:3000](http://localhost:3000)

## Getting Started

### 1. Add Your API Key

1. Visit the [Settings](http://localhost:3000/dashboard/settings) page
2. Click "Add Key"
3. Paste your OpenAI API key (starts with `sk-`)
4. Click "Save Key"

**Get your API key:**
- Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- Sign in with your OpenAI account
- Create a new API key
- Copy the key and paste it into the Settings page

### 2. Generate Videos

1. Go to the [Dashboard](http://localhost:3000/dashboard)
2. Enter a video prompt describing what you want to generate
3. Select video options:
   - **Orientation**: Landscape, Portrait, or Square
   - **Duration**: 5, 10, or 20 seconds
   - **Quality**: Standard or High
4. Click "Generate Video"
5. Wait for the video to be generated (typically 1-2 minutes)

### 3. View History

- Go to the [History](http://localhost:3000/dashboard/history) page to see all generated videos
- Download completed videos directly
- View video metadata (prompt, duration, quality, etc.)

## Project Structure

```
sora-video-generator/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx              # Main dashboard
│   │   ├── history/
│   │   │   └── page.tsx          # History view
│   │   ├── settings/
│   │   │   └── page.tsx          # Settings & API key
│   │   └── layout.tsx            # Dashboard layout with sidebar
│   ├── api/
│   │   ├── generate/route.ts     # Video generation endpoint
│   │   └── status/route.ts       # Status polling endpoint
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Redirects to dashboard
│   └── globals.css               # Global styles
├── components/
│   ├── sidebar.tsx               # Navigation sidebar
│   ├── video-generator.tsx       # Generation form
│   ├── video-preview.tsx         # Video player & polling
│   ├── api-key-input.tsx        # API key management
│   └── history-list.tsx         # History display
├── lib/
│   ├── sora-client.ts           # Sora API client
│   └── storage.ts               # Local storage management
└── public/                       # Static assets
```

## Configuration

### Environment Variables

Create a `.env.local` file for local development (optional):

```env
# No environment variables required for basic usage
# API key is stored in browser's localStorage
```

### Tailwind CSS

The project uses Tailwind CSS for styling. Customize the theme in `tailwind.config.ts`.

## Deployment on Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/sora-video-generator.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"
4. Select your `sora-video-generator` repository
5. Click "Deploy"

Your app will be live in minutes! Every push to main will auto-deploy.

## API Documentation

### Generate Video Endpoint

**POST** `/api/generate`

Request body:
```json
{
  "prompt": "A cat walking on a sunny beach",
  "orientation": "landscape",
  "duration": 5,
  "quality": "standard",
  "apiKey": "sk-..."
}
```

Response:
```json
{
  "videoId": "gen_1234567890_abc123",
  "message": "Video generation started"
}
```

### Check Status Endpoint

**GET** `/api/status?videoId=gen_1234567890_abc123&apiKey=sk-...`

or

**POST** `/api/status`

Request body:
```json
{
  "videoId": "gen_1234567890_abc123",
  "apiKey": "sk-..."
}
```

Response:
```json
{
  "id": "gen_1234567890_abc123",
  "status": "completed",
  "videoUrl": "https://..."
}
```

## Security

- **API Keys**: Stored locally in browser localStorage, never sent to our servers
- **CORS**: Direct communication with OpenAI API
- **No Backend**: Stateless architecture, no server-side storage
- **Client-Side**: All processing happens in your browser

## Pricing

Sora 2 API pricing (as of October 2025):
- 5-second videos: $0.02
- 10-second videos: $0.04
- 20-second videos: $0.08

Check [OpenAI's pricing page](https://openai.com/pricing/sora) for current rates.

## Troubleshooting

### "Invalid API key format"
- Ensure your API key starts with `sk-`
- Double-check you copied the entire key
- Visit [platform.openai.com/api-keys](https://platform.openai.com/api-keys) to generate a new one

### "Video generation timed out"
- The generation process may take longer than expected
- Refresh the page and check the status
- Try with a shorter duration or simpler prompt

### "API Error: 401"
- Your API key is invalid or expired
- Generate a new API key from OpenAI dashboard
- Update it in Settings

### Videos not displaying
- Check browser console for errors (F12)
- Ensure JavaScript is enabled
- Try clearing browser cache

## Tips for Best Results

1. **Detailed Prompts**: Be specific about what you want to see
   - ✅ Good: "A golden retriever puppy playing fetch in a sunny park"
   - ❌ Vague: "dog playing"

2. **Longer Durations**: Use 20 seconds for complex scenes with multiple actions

3. **Quality Settings**: Use High quality for important content, Standard for quick tests

4. **Aspect Ratios**: Choose the orientation that fits your use case

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

### Technology Stack

- **Framework**: Next.js 15.0.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI**: Built with React 19
- **API**: OpenAI Sora 2

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support & Feedback

For issues or suggestions:
1. Check this README for troubleshooting
2. Review your browser console for error messages
3. Verify your OpenAI API key has Sora 2 access

## Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Sora API Guide](https://platform.openai.com/docs/guides/video-generation)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

Built with ❤️ for video creators
