import { useState, useEffect } from 'react'
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
import { Edit2, ChevronDown } from 'lucide-react'
import { Observation } from '@/types'
import { TYPE_COLORS, RISK_COLORS } from '@/lib/constants'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Props {
  data: Observation[]
  onEdit: (obs: Observation) => void
  isSuperAdmin?: boolean
  hideActions?: boolean
}

const COLUMNS = {
  id: 'ID / Data',
  empresa: 'Empresa',
  observador: 'Observador',
  tipo: 'Tipo',
  detalhamento: 'Detalhamento',
  localizacao: 'Localização',
  risco: 'Risco',
  descricao: 'Descrição',
  resolucao: 'Resolução',
  acao: 'Ação Tomada / Feedback',
  status: 'Status',
  responsavel: 'Responsável',
  prazo: 'Prazo',
}

const DEFAULT_VISIBILITY = {
  id: true,
  empresa: true,
  observador: true,
  tipo: true,
  detalhamento: false,
  localizacao: true,
  risco: true,
  descricao: false,
  resolucao: false,
  acao: false,
  status: true,
  responsavel: false,
  prazo: false,
}

export function DataTable({ data, onEdit, isSuperAdmin, hideActions = false }: Props) {
  const [visibility, setVisibility] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('mapear-table-visibility')
      if (saved) return JSON.parse(saved)
    } catch (e) {}
    return DEFAULT_VISIBILITY
  })

  useEffect(() => {
    localStorage.setItem('mapear-table-visibility', JSON.stringify(visibility))
  }, [visibility])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-slate-500">
          {data.length} {data.length === 1 ? 'registro encontrado' : 'registros encontrados'}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto">
              Colunas <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            {Object.entries(COLUMNS).map(([key, label]) => {
              if (key === 'empresa' && !isSuperAdmin) return null
              return (
                <DropdownMenuCheckboxItem
                  key={key}
                  checked={visibility[key]}
                  onCheckedChange={(val) => setVisibility((prev) => ({ ...prev, [key]: val }))}
                >
                  {label}
                </DropdownMenuCheckboxItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border bg-white overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              {visibility.id && (
                <TableHead className="w-[120px] whitespace-nowrap">ID / Data</TableHead>
              )}
              {isSuperAdmin && visibility.empresa && (
                <TableHead className="whitespace-nowrap">Empresa</TableHead>
              )}
              {visibility.observador && (
                <TableHead className="whitespace-nowrap">Observador</TableHead>
              )}
              {visibility.tipo && <TableHead className="whitespace-nowrap">Tipo</TableHead>}
              {visibility.detalhamento && (
                <TableHead className="whitespace-nowrap">Detalhamento</TableHead>
              )}
              {visibility.localizacao && (
                <TableHead className="whitespace-nowrap">Localização</TableHead>
              )}
              {visibility.risco && <TableHead className="whitespace-nowrap">Risco</TableHead>}
              {visibility.descricao && (
                <TableHead className="whitespace-nowrap">Descrição</TableHead>
              )}
              {visibility.resolucao && (
                <TableHead className="whitespace-nowrap">Resolução</TableHead>
              )}
              {visibility.acao && (
                <TableHead className="whitespace-nowrap">Ação Tomada / Feedback</TableHead>
              )}
              {visibility.status && <TableHead className="whitespace-nowrap">Status</TableHead>}
              {visibility.responsavel && (
                <TableHead className="whitespace-nowrap">Responsável</TableHead>
              )}
              {visibility.prazo && <TableHead className="whitespace-nowrap">Prazo</TableHead>}
              {!hideActions && (
                <TableHead className="text-right whitespace-nowrap sticky right-0 bg-slate-50">
                  Ação
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={14} className="text-center py-8 text-slate-500">
                  Nenhum relato encontrado.
                </TableCell>
              </TableRow>
            ) : (
              data.map((obs) => (
                <TableRow key={obs.id} className="hover:bg-slate-50/50 group">
                  {visibility.id && (
                    <TableCell className="whitespace-nowrap font-medium">
                      <div className="flex flex-col">
                        <span>{obs.id}</span>
                        <span className="text-xs text-slate-500 font-normal">
                          {new Date(obs.date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </TableCell>
                  )}
                  {isSuperAdmin && visibility.empresa && (
                    <TableCell className="text-sm text-slate-600 whitespace-nowrap">
                      {obs.companyName || '-'}
                    </TableCell>
                  )}
                  {visibility.observador && (
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium whitespace-nowrap">
                          {obs.observer.name}
                        </span>
                        <span className="text-xs text-slate-500 whitespace-nowrap">
                          {obs.observer.cpf || obs.observer.email}
                        </span>
                      </div>
                    </TableCell>
                  )}
                  {visibility.tipo && (
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 whitespace-nowrap ${TYPE_COLORS[obs.type] || 'text-slate-600 bg-slate-100'}`}
                      >
                        {obs.type}
                      </Badge>
                    </TableCell>
                  )}
                  {visibility.detalhamento && (
                    <TableCell className="text-sm max-w-[150px] truncate" title={obs.detail}>
                      {obs.detail || '-'}
                    </TableCell>
                  )}
                  {visibility.localizacao && (
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm whitespace-nowrap">{obs.area}</span>
                        <span className="text-xs text-slate-500 whitespace-nowrap">
                          {obs.shift} {obs.machine ? `| Máq: ${obs.machine}` : ''}
                        </span>
                      </div>
                    </TableCell>
                  )}
                  {visibility.risco && (
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 whitespace-nowrap ${RISK_COLORS[obs.riskLevel] || 'text-slate-600 bg-slate-100'}`}
                      >
                        {obs.riskLevel || '-'}
                      </Badge>
                    </TableCell>
                  )}
                  {visibility.descricao && (
                    <TableCell className="text-sm max-w-[200px] truncate" title={obs.description}>
                      {obs.description || '-'}
                    </TableCell>
                  )}
                  {visibility.resolucao && (
                    <TableCell className="text-sm max-w-[150px] truncate whitespace-nowrap">
                      {obs.resolutionType || '-'}
                    </TableCell>
                  )}
                  {visibility.acao && (
                    <TableCell
                      className="text-sm max-w-[150px] truncate whitespace-nowrap"
                      title={obs.managerComments}
                    >
                      {obs.managerComments || '-'}
                    </TableCell>
                  )}
                  {visibility.status && (
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
                        className="whitespace-nowrap"
                      >
                        {obs.status}
                      </Badge>
                    </TableCell>
                  )}
                  {visibility.responsavel && (
                    <TableCell className="text-sm whitespace-nowrap">
                      {obs.assignedTo || '-'}
                    </TableCell>
                  )}
                  {visibility.prazo && (
                    <TableCell className="text-sm whitespace-nowrap">
                      {obs.dueDate ? new Date(obs.dueDate).toLocaleDateString('pt-BR') : '-'}
                    </TableCell>
                  )}
                  {!hideActions && (
                    <TableCell className="text-right sticky right-0 bg-white group-hover:bg-slate-50/50 transition-colors shadow-[-12px_0_15px_-10px_rgba(0,0,0,0.05)]">
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
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
