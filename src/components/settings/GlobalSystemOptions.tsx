import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Plus, Edit2, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { GlobalOptDialog } from './GlobalOptDialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function GlobalSystemOptions({ definition }: { definition: any }) {
  const [options, setOptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editOpt, setEditOpt] = useState<any | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const { toast } = useToast()

  const fetchOptions = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('tabelas_sistema_opcoes')
      .select('*')
      .eq('tabela_id', definition.id)
      .order('data_criacao')
    if (data) setOptions(data)
    setLoading(false)
  }, [definition.id])

  useEffect(() => {
    fetchOptions()
  }, [fetchOptions])

  const handleDelete = async (optId: string) => {
    if (!window.confirm('Deseja realmente remover esta opção padrão global?')) return
    const { error } = await supabase.from('tabelas_sistema_opcoes').delete().eq('id', optId)
    if (error) {
      toast({ variant: 'destructive', title: 'Erro', description: error.message })
    } else {
      toast({ title: 'Removido', description: 'Opção removida com sucesso.' })
      fetchOptions()
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">{definition.nome_tabela}</h3>
          <p className="text-sm text-slate-500 mt-1">
            {definition.descricao || 'Gerencie as opções globais padrão.'}
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Nova Opção
        </Button>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Nome / Rótulo</TableHead>
              <TableHead>Valor Padrão do Sistema</TableHead>
              <TableHead className="w-[100px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {options.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-slate-500">
                  Nenhuma opção configurada nesta tabela.
                </TableCell>
              </TableRow>
            ) : (
              options.map((opt) => (
                <TableRow key={opt.id}>
                  <TableCell className="font-medium">{opt.nome_opcao}</TableCell>
                  <TableCell className="font-mono text-xs text-slate-600">
                    <div className="truncate max-w-[350px]">{opt.valor_padrao}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditOpt(opt)}
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4 text-slate-500 hover:text-primary" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(opt.id)}
                      title="Remover"
                    >
                      <Trash2 className="w-4 h-4 text-slate-500 hover:text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <GlobalOptDialog
        isOpen={isAddOpen || !!editOpt}
        onClose={() => {
          setIsAddOpen(false)
          setEditOpt(null)
        }}
        option={editOpt}
        tabelaId={definition.id}
        onSaved={fetchOptions}
      />
    </div>
  )
}
