'use client'

import { useState } from 'react'

interface Template {
  id: string
  name: string
  description: string
  prompt: string
  category: 'nature' | 'tech' | 'urban' | 'animation' | 'lifestyle'
  duration?: 5 | 10 | 20
}

const TEMPLATES: Template[] = [
  {
    id: 'template-1',
    name: 'Sunset Beach',
    description: 'Golden hour at a tropical beach',
    prompt: 'A beautiful golden hour sunset on a tropical beach with gentle waves, palm trees swaying in the breeze, and warm amber light reflecting off the sand',
    category: 'nature',
    duration: 10,
  },
  {
    id: 'template-2',
    name: 'Tech Showcase',
    description: 'Modern product launch video',
    prompt: 'A sleek futuristic tech product being presented on a minimalist stage with smooth camera pans, dynamic lighting, and subtle particle effects',
    category: 'tech',
    duration: 10,
  },
  {
    id: 'template-3',
    name: 'Urban Timelapse',
    description: 'City life throughout the day',
    prompt: 'A fast-paced timelapse of a modern city skyline during sunrise, showing traffic flow, bustling streets, and buildings transitioning through different lighting',
    category: 'urban',
    duration: 20,
  },
  {
    id: 'template-4',
    name: '3D Animation',
    description: 'Abstract geometric animation',
    prompt: 'Smooth 3D geometric shapes morphing and rotating, with neon colors, smooth transitions, modern aesthetic, minimalist composition',
    category: 'animation',
    duration: 5,
  },
  {
    id: 'template-5',
    name: 'Mountain Adventure',
    description: 'Cinematic mountain landscape',
    prompt: 'Breathtaking drone footage of snow-capped mountain peaks, flowing through alpine valleys, with cinematic lighting and smooth camera movements',
    category: 'nature',
    duration: 20,
  },
  {
    id: 'template-6',
    name: 'Lifestyle Vlog',
    description: 'Daily lifestyle moments',
    prompt: 'Candid lifestyle moments - morning coffee, workspace setup, creative work, natural lighting, warm and inviting atmosphere',
    category: 'lifestyle',
    duration: 10,
  },
]

interface TemplateGalleryProps {
  onSelectTemplate: (prompt: string, duration?: 5 | 10 | 20) => void
}

export default function TemplateGallery({ onSelectTemplate }: TemplateGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'nature', label: 'Nature' },
    { id: 'tech', label: 'Technology' },
    { id: 'urban', label: 'Urban' },
    { id: 'animation', label: 'Animation' },
    { id: 'lifestyle', label: 'Lifestyle' },
  ]

  const filteredTemplates = selectedCategory === 'all'
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category === selectedCategory)

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredTemplates.map(template => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template.prompt, template.duration)}
            className="card p-4 text-left hover:border-neutral-400 hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold text-neutral-900">{template.name}</h4>
                <p className="text-xs text-neutral-500 mt-1">{template.description}</p>
              </div>
              <div className="text-xs px-2 py-1 bg-neutral-100 rounded text-neutral-600 font-medium flex-shrink-0">
                {template.duration}s
              </div>
            </div>
            <p className="text-xs text-neutral-600 line-clamp-2">{template.prompt}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
