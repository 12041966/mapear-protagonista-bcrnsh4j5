import { useState, useMemo } from 'react'
import { MetricsCards } from '@/components/dashboard/MetricsCards'
import { DashboardCharts } from '@/components/dashboard/Charts'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useMainStore } from '@/stores/main'

const Index = () => {
  const { observations } = useMainStore()
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
          </SelectContent>
        </Select>
      </div>

      <MetricsCards data={filteredData} />
      <DashboardCharts data={filteredData} />
      <RecentActivity data={filteredData} />
    </div>
  )
}

export default Index
