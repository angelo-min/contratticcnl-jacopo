import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Users, Hash } from 'lucide-react'
import type { CCNLGuideInfo } from '@/types/ccnl'

interface GuideInfoCardProps {
  info: CCNLGuideInfo
}

export function GuideInfoCard({ info }: GuideInfoCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="font-heading text-lg font-bold">
          Scheda contratto
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div>
          <span className="font-medium text-foreground">Titolo</span>
          <p className="mt-0.5 text-muted-foreground">{info.titolo}</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary">{info.settore}</Badge>
        </div>

        <div className="flex items-start gap-2">
          <Users className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <span className="font-medium text-foreground">Contraenti datoriali</span>
            <p className="mt-0.5 text-muted-foreground">{info.contraenti_datoriali}</p>
          </div>
        </div>

        {info.contraenti_sindacali && (
          <div className="flex items-start gap-2">
            <Users className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <span className="font-medium text-foreground">Contraenti sindacali</span>
              <p className="mt-0.5 text-muted-foreground">{info.contraenti_sindacali}</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Hash className="h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <span className="font-medium text-foreground">Codice CNEL: </span>
            <span className="text-muted-foreground">{info.codice_cnel}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <span className="font-medium text-foreground">Scadenza: </span>
            <span className="text-muted-foreground">{info.scadenza}</span>
          </div>
        </div>

        {info.data_stipula && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <span className="font-medium text-foreground">Stipula: </span>
              <span className="text-muted-foreground">{info.data_stipula}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
