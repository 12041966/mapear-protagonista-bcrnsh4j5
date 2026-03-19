import { useState, useMemo } from 'react'
import { Navigate } from 'react-router-dom'
import { MetricsCards } from '@/components/dashboard/MetricsCards'
import { DashboardCharts } from '@/components/dashboard/Charts'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { Activity } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useMainStore } from '@/stores/main'

const Index = () => {
  const { observations, currentUser } = useMainStore()
  const [period, setPeriod] = useState<string>('30d')

  const filteredData = useMemo(() => {
    const now = new Date()
    return observations.filter((obs) => {
      const obsDate = new Date(obs.date)
      if (period === '30d') {
        const thirtyDaysAgo = new Date(now)
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        return obsDate >= thirtyDaysAgo
      }
      if (period === 'year') {
        return obsDate.getFullYear() === now.getFullYear()
      }
      return true
    })
  }, [observations, period])

  if (currentUser?.role === 'Observador') {
    return <Navigate to="/nova-observacao" replace />
  }

  const hasData = filteredData.length > 0

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Visão Geral</h2>
          <p className="text-sm text-slate-500">
            Acompanhe os indicadores de cultura de segurança da sua empresa.
          </p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
            <SelectItem value="year">Este ano</SelectItem>
            <SelectItem value="all">Todo período</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center p-12 mt-6 bg-white border rounded-xl border-dashed border-slate-300">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Activity className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">Nenhum dado encontrado</h3>
          <p className="text-slate-500 max-w-md text-center mt-2">
            Sua empresa ainda não possui observações de segurança registradas para o período
            selecionado.
          </p>
        </div>
      ) : (
        <>
          <MetricsCards data={filteredData} />
          <DashboardCharts data={filteredData} />
          <RecentActivity data={filteredData} />
        </>
      )}
    </div>
  )
}

export default Index
