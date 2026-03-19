import { useState } from 'react'
import { useMainStore } from '@/stores/main'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Trash2, Plus, Loader2, AlertTriangle } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

export function HeadcountSettings() {
  const { settings, updateSettings, currentUser, isSuperAdmin, activeCompanyId } = useMainStore()
  const { toast } = useToast()
  const [month, setMonth] = useState('')
  const [count, setCount] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  if (isSuperAdmin && activeCompanyId === 'all') {
    return (
      <div className="bg-white border rounded-lg p-8 text-center shadow-sm animate-fade-in-up">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Selecione uma Empresa</h2>
        <p className="text-slate-600 max-w-md mx-auto">
          Para gerenciar o efetivo mensal, selecione uma empresa específica no seletor do topo da
          página.
        </p>
      </div>
    )
  }

  const targetCompanyId =
    isSuperAdmin && activeCompanyId !== 'all' ? activeCompanyId : currentUser?.companyId

  const handleAdd = async () => {
    if (!month || !count || !targetCompanyId) return
    setIsSaving(true)
    const [ano, mesStr] = month.split('-')
    const quantidade = parseInt(count, 10)

    const { error } = await supabase.from('efetivo_mensal').insert({
      empresa_id: targetCompanyId,
      mes: mesStr,
      ano: parseInt(ano, 10),
      quantidade,
    })

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description:
          'Não foi possível salvar o efetivo mensal. Verifique se o mês já não está cadastrado.',
      })
    } else {
      updateSettings({
        ...settings,
        monthlyHeadcount: {
          ...settings.monthlyHeadcount,
          [month]: quantidade,
        },
      })
      setMonth('')
      setCount('')
      toast({ title: 'Sucesso', description: 'Efetivo cadastrado com sucesso.' })
    }
    setIsSaving(false)
  }

  const handleRemove = async (m: string) => {
    if (!targetCompanyId) return
    setIsSaving(true)
    const [ano, mesStr] = m.split('-')
    const { error } = await supabase
      .from('efetivo_mensal')
      .delete()
      .eq('empresa_id', targetCompanyId)
      .eq('mes', mesStr)
      .eq('ano', parseInt(ano, 10))

    if (!error) {
      const newHc = { ...settings.monthlyHeadcount }
      delete newHc[m]
      updateSettings({ ...settings, monthlyHeadcount: newHc })
    } else {
      toast({ variant: 'destructive', title: 'Erro', description: 'Falha ao remover o registro.' })
    }
    setIsSaving(false)
  }

  const sortedMonths = Object.keys(settings.monthlyHeadcount || {}).sort((a, b) =>
    b.localeCompare(a),
  )

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6 max-w-3xl relative">
      {isSaving && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-lg">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium">Efetivo Mensal da Empresa</h3>
        <p className="text-sm text-slate-500">
          Configure o número de funcionários por mês para o cálculo dos indicadores de engajamento.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="grid gap-2 flex-1">
          <Label>Mês (YYYY-MM)</Label>
          <Input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            disabled={isSaving}
          />
        </div>
        <div className="grid gap-2 flex-1">
          <Label>Número Total de Funcionários</Label>
          <Input
            type="number"
            min="1"
            placeholder="Ex: 150"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            disabled={isSaving}
          />
        </div>
        <Button
          onClick={handleAdd}
          className="w-full sm:w-auto"
          disabled={isSaving || !month || !count}
        >
          <Plus className="w-4 h-4 mr-2" /> Salvar
        </Button>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Competência</TableHead>
              <TableHead>Efetivo Declarado</TableHead>
              <TableHead className="text-right">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedMonths.map((m) => (
              <TableRow key={m}>
                <TableCell className="font-medium">{m}</TableCell>
                <TableCell>{settings.monthlyHeadcount[m]} colaboradores</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(m)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    disabled={isSaving}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {sortedMonths.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-slate-500">
                  Nenhum registro de efetivo encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
