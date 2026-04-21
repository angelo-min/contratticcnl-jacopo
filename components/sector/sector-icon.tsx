import {
  Wheat,
  FlaskConical,
  Wrench,
  Shirt,
  UtensilsCrossed,
  HardHat,
  Clapperboard,
  Store,
  Home,
  Truck,
  Landmark,
  Zap,
  Stethoscope,
  Boxes,
  Building2,
  Building,
  HeartPulse,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  Wheat,
  FlaskConical,
  Wrench,
  Shirt,
  UtensilsCrossed,
  HardHat,
  Clapperboard,
  Store,
  Home,
  Truck,
  Landmark,
  Zap,
  Stethoscope,
  Boxes,
  Building2,
  Building,
  HeartPulse,
  GraduationCap,
}

interface SectorIconProps {
  name: string
  className?: string
}

export function SectorIcon({ name, className }: SectorIconProps) {
  const Icon = iconMap[name] ?? Boxes
  return <Icon className={className} strokeWidth={1.5} aria-hidden="true" />
}
