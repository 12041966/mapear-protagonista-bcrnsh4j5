import { useMainStore } from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, CheckCircle, AlertOctagon, Users } from 'lucide-react'
import { Observation } from '@/types'

export function MetricsCards({ data }: { data: Observation[] }) {
  const { settings } = useMainStore()

  const total = data.length
  const concluidos = data.filter((o) => o.status === 'Concluído').length
  const pctConcluidos = total > 0 ? Math.round((concluidos / total) * 100) : 0
  const critical = data.filter(
    (o) => o.riskLevel === 'Muito Grave' || o.type === 'Acidente' || o.type === 'Quase acidente',
  ).length

  const currentMonth = new Date().toISOString().slice(0, 7)
  const headcount = settings.monthlyHeadcount?.[currentMonth] || 100
  const uniqueObservers = new Set(data.map((o) => o.observer.cpf)).size
  const participation = headcount > 0 ? Math.round((uniqueObservers / headcount) * 100) : 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-slate-500">Total Observações</CardTitle>
          <Activity className="w-4 h-4 text-slate-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{total}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-slate-500">Ações Concluídas</CardTitle>
          <CheckCircle className="w-4 h-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pctConcluidos}%</div>
          <p className="text-xs text-slate-400 mt-1">
            {concluidos} de {total} resolvidas
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-slate-500">Alertas Críticos</CardTitle>
          <AlertOctagon className="w-4 h-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{critical}</div>
          <p className="text-xs text-slate-400 mt-1">Requerem atenção imediata</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-slate-500">Participação Mensal</CardTitle>
          <Users className="w-4 h-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{participation}%</div>
          <p className="text-xs text-slate-400 mt-1">Colaboradores ativos ({uniqueObservers})</p>
        </CardContent>
      </Card>
    </div>
  )
}
