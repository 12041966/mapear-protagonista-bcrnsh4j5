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
import { Switch } from '@/components/ui/switch'
import { Edit2, Loader2 } from 'lucide-react'
import { Tables } from '@/lib/supabase/types'

type Empresa = Tables<'empresas'>

interface Props {
  data: Empresa[]
  isLoading: boolean
  onEdit: (empresa: Empresa) => void
  onToggleStatus: (empresa: Empresa) => void
}

export function EmpresasTable({ data, isLoading, onEdit, onToggleStatus }: Props) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12 text-slate-500">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Carregando empresas...
      </div>
    )
  }

  return (
    <Table>
      <TableHeader className="bg-slate-50">
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>CNPJ</TableHead>
          <TableHead>Email de Contato</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8 text-slate-500">
              Nenhuma empresa cadastrada no sistema.
            </TableCell>
          </TableRow>
        ) : (
          data.map((empresa) => (
            <TableRow key={empresa.id} className="hover:bg-slate-50/50">
              <TableCell className="font-medium text-slate-900">{empresa.nome}</TableCell>
              <TableCell className="text-slate-600">{empresa.cnpj || '-'}</TableCell>
              <TableCell className="text-slate-600">{empresa.email_contato || '-'}</TableCell>
              <TableCell>
                <Badge
                  variant={empresa.ativa ? 'default' : 'secondary'}
                  className={empresa.ativa ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
                >
                  {empresa.ativa ? 'Ativa' : 'Inativa'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-3">
                  <div
                    className="flex items-center gap-2"
                    title={empresa.ativa ? 'Desativar empresa' : 'Ativar empresa'}
                  >
                    <Switch
                      checked={empresa.ativa}
                      onCheckedChange={() => onToggleStatus(empresa)}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(empresa)}
                    className="h-8 px-2 text-primary"
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Editar</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
