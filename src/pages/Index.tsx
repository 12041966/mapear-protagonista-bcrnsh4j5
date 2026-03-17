import { MetricsCards } from '@/components/dashboard/MetricsCards'
import { DashboardCharts } from '@/components/dashboard/Charts'
import { RecentActivity } from '@/components/dashboard/RecentActivity'

const Index = () => {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Visão Geral</h2>
          <p className="text-sm text-slate-500">
            Acompanhe os indicadores de cultura de segurança da sua empresa.
          </p>
        </div>
      </div>

      <MetricsCards />
      <DashboardCharts />
      <RecentActivity />
    </div>
  )
}

export default Index
