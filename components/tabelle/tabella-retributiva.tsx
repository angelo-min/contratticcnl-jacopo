import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { TabellaRetributiva } from '@/types/ccnl'

interface TabellaRetributivaProps {
  tabella: TabellaRetributiva
}

const currencyFormatter = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
})

function formatDecorrenza(iso: string): string {
  const [y, m, d] = iso.split('-')
  const months = [
    'gennaio',
    'febbraio',
    'marzo',
    'aprile',
    'maggio',
    'giugno',
    'luglio',
    'agosto',
    'settembre',
    'ottobre',
    'novembre',
    'dicembre',
  ]
  return `${parseInt(d, 10)} ${months[parseInt(m, 10) - 1]} ${y}`
}

export function TabellaRetributivaView({ tabella }: TabellaRetributivaProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-xl font-bold">
          Minimi tabellari per livello
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Decorrenza: {formatDecorrenza(tabella.decorrenza)}
        </p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Livello</TableHead>
              <TableHead className="text-right">Minimo tabellare</TableHead>
              <TableHead className="text-right">Scatti anzianità</TableHead>
              <TableHead className="text-right">Totale</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tabella.righe.map((riga) => (
              <TableRow key={riga.livello}>
                <TableCell className="font-medium">{riga.livello}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {currencyFormatter.format(riga.minimoTabellare)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {riga.scatti !== null ? currencyFormatter.format(riga.scatti) : '—'}
                </TableCell>
                <TableCell className="text-right tabular-nums font-semibold">
                  {currencyFormatter.format(riga.totale)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {tabella.nota && (
          <p className="mt-4 text-xs text-muted-foreground">{tabella.nota}</p>
        )}
      </CardContent>
    </Card>
  )
}
