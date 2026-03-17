import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer,
} from 'recharts'
import { useMainStore } from '@/stores/main'

export function DashboardCharts() {
  const { observations } = useMainStore()

  const typeData = useMemo(() => {
    const counts = observations.reduce(
      (acc, curr) => {
        acc[curr.type] = (acc[curr.type] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [observations])

  const COLORS = ['#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899']

  const trendData = [
    { name: 'Out', obs: 12 },
    { name: 'Nov', obs: 19 },
    { name: 'Dez', obs: 15 },
    { name: 'Jan', obs: 22 },
    { name: 'Fev', obs: 28 },
    { name: 'Mar', obs: observations.length + 5 },
  ]

  const areaData = useMemo(() => {
    const counts = observations.reduce(
      (acc, curr) => {
        acc[curr.area] = (acc[curr.area] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
  }, [observations])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-base">Observações por Tipo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {typeData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Tendência Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            <ChartContainer
              config={{ obs: { label: 'Observações', color: 'hsl(var(--primary))' } }}
              className="h-full w-full"
            >
              <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="obs"
                  stroke="var(--color-obs)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: 'var(--color-obs)' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-base">Distribuição por Área</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            <ChartContainer
              config={{ value: { label: 'Relatos', color: '#f59e0b' } }}
              className="h-full w-full"
            >
              <BarChart data={areaData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  allowDecimals={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
