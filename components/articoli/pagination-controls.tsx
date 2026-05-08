import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from '@/components/ui/pagination'

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  buildHref: (pageNum: number) => string
}

export function buildPageItems(
  current: number,
  total: number,
): Array<number | 'ellipsis'> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const items: Array<number | 'ellipsis'> = [1]
  if (current > 3) items.push('ellipsis')
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    items.push(i)
  }
  if (current < total - 2) items.push('ellipsis')
  items.push(total)
  return items
}

export function PaginationControls({
  currentPage,
  totalPages,
  buildHref,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null
  const items = buildPageItems(currentPage, totalPages)

  return (
    <Pagination className="mt-12">
      <PaginationContent>
        <PaginationItem>
          {currentPage > 1 ? (
            <PaginationLink
              href={buildHref(currentPage - 1)}
              size="default"
              className="gap-1 px-2.5"
              aria-label="Pagina precedente"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:block">Precedente</span>
            </PaginationLink>
          ) : (
            <span
              aria-hidden="true"
              className="pointer-events-none flex h-9 items-center gap-1 rounded-md px-2.5 text-sm text-muted-foreground/50"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:block">Precedente</span>
            </span>
          )}
        </PaginationItem>

        {items.map((item, i) =>
          item === 'ellipsis' ? (
            <PaginationItem key={`e-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                href={buildHref(item)}
                isActive={item === currentPage}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          {currentPage < totalPages ? (
            <PaginationLink
              href={buildHref(currentPage + 1)}
              size="default"
              className="gap-1 px-2.5"
              aria-label="Pagina successiva"
            >
              <span className="hidden sm:block">Successiva</span>
              <ChevronRight className="h-4 w-4" />
            </PaginationLink>
          ) : (
            <span
              aria-hidden="true"
              className="pointer-events-none flex h-9 items-center gap-1 rounded-md px-2.5 text-sm text-muted-foreground/50"
            >
              <span className="hidden sm:block">Successiva</span>
              <ChevronRight className="h-4 w-4" />
            </span>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
