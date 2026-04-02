'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText } from 'lucide-react'
import type { CCNL } from '@/types/ccnl'
import { getAccordiByccnlId } from '@/data/db'

interface CCNLTabsProps {
  ccnl: CCNL
}

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null
  const parts = dateStr.split('/')
  if (parts.length !== 3) return null
  const day = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10) - 1
  let year = parseInt(parts[2], 10)
  if (year < 100) year += 2000
  return new Date(year, month, day)
}

function formatDate(dateStr: string): string {
  const date = parseDate(dateStr)
  if (!date) return dateStr
  return date.toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function CCNLTabs({ ccnl }: CCNLTabsProps) {
  const accordi = getAccordiByccnlId(ccnl.id)

  return (
    <Tabs defaultValue="info" className="w-full">
      <TabsList className="w-full justify-start border-b bg-transparent p-0 overflow-x-auto">
        <TabsTrigger
          value="info"
          className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
        >
          Informazioni
        </TabsTrigger>
        <TabsTrigger
          value="accordi"
          className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
        >
          Accordi ({accordi.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="info" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-xl font-bold">
              Dettagli del contratto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <span className="text-sm font-medium text-foreground">Settore</span>
                <p className="mt-0.5 text-sm text-muted-foreground">{ccnl.settore}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-foreground">Sottosettore</span>
                <p className="mt-0.5 text-sm text-muted-foreground">{ccnl.sottosettore}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-foreground">Codice CNEL</span>
                <p className="mt-0.5 text-sm text-muted-foreground">{ccnl.id}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-foreground">Scadenza</span>
                <p className="mt-0.5 text-sm text-muted-foreground">{ccnl.scadenza}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-foreground">Tipologia</span>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {ccnl.settorePrivPubb.charAt(0).toUpperCase() + ccnl.settorePrivPubb.slice(1)}
                  {ccnl.dirigenti ? ' — Dirigenti' : ''}
                </p>
              </div>
              {ccnl.nDipendenti && (
                <div>
                  <span className="text-sm font-medium text-foreground">Dipendenti (2023)</span>
                  <p className="mt-0.5 text-sm text-muted-foreground">{ccnl.nDipendenti}</p>
                </div>
              )}
            </div>

            <div className="border-t border-border pt-4">
              <span className="text-sm font-medium text-foreground">Firmatari datoriali</span>
              <p className="mt-0.5 text-sm text-muted-foreground">{ccnl.firmatariDatori}</p>
            </div>

            <div>
              <span className="text-sm font-medium text-foreground">Firmatari sindacali</span>
              <p className="mt-0.5 text-sm text-muted-foreground">{ccnl.firmatariSindacali}</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="accordi" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-xl font-bold">
              Accordi depositati al CNEL
            </CardTitle>
          </CardHeader>
          <CardContent>
            {accordi.length > 0 ? (
              <div className="space-y-4">
                {accordi.map((accordo) => (
                  <div
                    key={accordo.protocollo}
                    className="rounded-lg border border-border bg-muted/30 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {accordo.tipologia}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Prot. {accordo.protocollo}
                          </span>
                        </div>
                        <h4 className="mt-2 font-medium text-foreground">
                          {accordo.titolo}
                        </h4>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Stipula: {formatDate(accordo.data_stipula)}
                          {accordo.data_scadenza && ` — Scadenza: ${formatDate(accordo.data_scadenza)}`}
                        </p>
                      </div>
                      <a
                        href={accordo.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex shrink-0 items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <FileText className="h-4 w-4" />
                        PDF
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                Non ci sono accordi depositati al CNEL per questo contratto.
              </p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
