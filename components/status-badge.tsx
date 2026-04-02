import { Badge } from '@/components/ui/badge'
import type { CCNLStatus } from '@/types/ccnl'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: CCNLStatus
  className?: string
}

const statusConfig: Record<CCNLStatus, { label: string; className: string }> = {
  vigente: {
    label: 'Vigente',
    className: 'bg-status-vigente/10 text-status-vigente border-status-vigente/20 hover:bg-status-vigente/20',
  },
  scaduto: {
    label: 'Scaduto',
    className: 'bg-status-scaduto/10 text-status-scaduto border-status-scaduto/20 hover:bg-status-scaduto/20',
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}
