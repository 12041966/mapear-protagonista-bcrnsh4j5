import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit2 } from 'lucide-react'
import { Observation } from '@/types'
import { TYPE_COLORS, RISK_COLORS } from '@/lib/constants'

interface Props {
  data: Observation[]
  onEdit: (obs: Observation) => void
  isSuperAdmin?: boolean
}

export function DataTable({ data, onEdit, isSuperAdmin }: Props) {
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="w-[120px]">ID / Data</TableHead>
            {isSuperAdmin && <TableHead className="hidden md:table-cell">Empresa</TableHead>}
            <TableHead>Tipo / Risco</TableHead>
            <TableHead>Área</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isSuperAdmin ? 6 : 5} className="text-center py-8 text-slate-500">
                Nenhum relato encontrado.
              </TableCell>
            </TableRow>
          ) : (
            data.map((obs) => (
              <TableRow key={obs.id} className="hover:bg-slate-50/50">
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{obs.id}</span>
                    <span className="text-xs text-slate-500 font-normal">
                      {new Date(obs.date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </TableCell>
                {isSuperAdmin && (
                  <TableCell className="hidden md:table-cell text-sm text-slate-600">
                    {obs.companyName || '-'}
                  </TableCell>
                )}
                <TableCell>
                  <div className="flex flex-col gap-1 items-start">
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 ${TYPE_COLORS[obs.type] || 'text-slate-600 bg-slate-100'}`}
                    >
                      {obs.type}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 ${RISK_COLORS[obs.riskLevel] || 'text-slate-600 bg-slate-100'}`}
                    >
                      {obs.riskLevel}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{obs.area}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      obs.status === 'Concluído'
                        ? 'secondary'
                        : obs.status === 'Em Análise'
                          ? 'default'
                          : obs.status === 'Cancelada'
                            ? 'destructive'
                            : 'outline'
                    }
                  >
                    {obs.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(obs)}
                    className="h-8 px-2 text-primary"
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Tratar</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
