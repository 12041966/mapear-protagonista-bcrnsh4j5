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
import { Trash2, Plus } from 'lucide-react'

export function HeadcountSettings() {
  const { settings, updateSettings } = useMainStore()
  const [month, setMonth] = useState('')
  const [count, setCount] = useState('')

  const handleAdd = () => {
    if (!month || !count) return
    updateSettings({
      ...settings,
      monthlyHeadcount: {
        ...settings.monthlyHeadcount,
        [month]: parseInt(count, 10),
      },
    })
    setMonth('')
    setCount('')
  }

  const handleRemove = (m: string) => {
    const newHc = { ...settings.monthlyHeadcount }
    delete newHc[m]
    updateSettings({ ...settings, monthlyHeadcount: newHc })
  }

  const sortedMonths = Object.keys(settings.monthlyHeadcount || {}).sort((a, b) =>
    b.localeCompare(a),
  )

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6 max-w-3xl">
      <div>
        <h3 className="text-lg font-medium">Efetivo Mensal</h3>
        <p className="text-sm text-slate-500">
          Configure o número de funcionários por mês para o cálculo do % de engajamento.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="grid gap-2 flex-1">
          <Label>Mês (YYYY-MM)</Label>
          <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
        </div>
        <div className="grid gap-2 flex-1">
          <Label>Número Total de Funcionários</Label>
          <Input
            type="number"
            min="1"
            placeholder="Ex: 150"
            value={count}
            onChange={(e) => setCount(e.target.value)}
          />
        </div>
        <Button onClick={handleAdd} className="w-full sm:w-auto">
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
