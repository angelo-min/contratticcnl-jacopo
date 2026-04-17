'use client'

import { cn } from '@/lib/utils'

type AdFormat = 'leaderboard' | 'rectangle' | 'video'

const formatSizes: Record<AdFormat, { width: string; height: string; label: string }> = {
  leaderboard: { width: 'w-full max-w-[728px]', height: 'h-[90px]', label: '728 × 90' },
  rectangle: { width: 'w-[300px]', height: 'h-[250px]', label: '300 × 250' },
  video: { width: 'w-full max-w-[480px]', height: 'h-[270px]', label: 'Video Ad' },
}

interface AdSlotProps {
  format: AdFormat
  className?: string
}

export function AdSlot({ format, className }: AdSlotProps) {
  const size = formatSizes[format]

  return (
    <div
      className={cn(
        'mx-auto flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/30',
        size.width,
        size.height,
        className,
      )}
    >
      <div className="text-center">
        <p className="text-xs font-medium text-muted-foreground/50 uppercase tracking-wider">
          Spazio pubblicitario
        </p>
        <p className="mt-1 text-xs text-muted-foreground/30">
          {size.label}
        </p>
      </div>
    </div>
  )
}
