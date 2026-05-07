import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { CCNLGuideInfo } from '@/types/ccnl'

interface GuideInfoCardProps {
  info: CCNLGuideInfo
}

export function GuideInfoCard({ info }: GuideInfoCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="font-heading text-base font-bold">
          Scheda contratto
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <Badge variant="secondary">{info.settore}</Badge>

        {info.contraenti_datoriali && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Parte datoriale
            </p>
            <p className="mt-0.5 text-foreground">{info.contraenti_datoriali}</p>
          </div>
        )}

        {info.contraenti_sindacali && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Parte sindacale
            </p>
            <p className="mt-0.5 text-foreground">{info.contraenti_sindacali}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {info.codice_cnel && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Codice CNEL
              </p>
              <p className="mt-0.5 font-mono font-medium text-foreground">{info.codice_cnel}</p>
            </div>
          )}
          {info.scadenza && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Scadenza
              </p>
              <p className="mt-0.5 text-foreground">{info.scadenza}</p>
            </div>
          )}
          {info.data_stipula && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Stipula
              </p>
              <p className="mt-0.5 text-foreground">{info.data_stipula}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
