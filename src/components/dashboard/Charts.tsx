import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig,
} from '@/components/ui/chart'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Observation } from '@/types'
import { CHART_COLORS } from '@/lib/constants'

export function DashboardCharts({ data }: { data: Observation[] }) {
  const typeData = useMemo(() => {
    const counts = data.reduce(
      (acc, curr) => ({ ...acc, [curr.type]: (acc[curr.type] || 0) + 1 }),
      {} as Record<string, number>,
    )
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [data])

  const typeConfig = useMemo(() => {
    return typeData.reduce((acc, d, i) => {
      acc[d.name] = {
        label: d.name,
        color: CHART_COLORS[d.name] || `hsl(${(i * 137) % 360}, 70%, 50%)`,
      }
      return acc
    }, {} as ChartConfig)
  }, [typeData])

  const trendData = useMemo(() => {
    const grouped = data.reduce(
      (acc, obs) => {
        const d = new Date(obs.date)
        const rawMonth = d.toLocaleString('pt-BR', { month: 'short' }).replace('.', '')
        const month = rawMonth.charAt(0).toUpperCase() + rawMonth.slice(1)
        const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`

        if (!acc[key]) acc[key] = { name: month, abertos: 0, fechados: 0, sortKey: key }

        if (obs.status === 'Concluído') {
          acc[key].fechados++
        } else {
          acc[key].abertos++
        }

        return acc
      },
      {} as Record<string, { name: string; abertos: number; fechados: number; sortKey: string }>,
    )

    return Object.values(grouped).sort((a, b) => a.sortKey.localeCompare(b.sortKey))
  }, [data])

  const areaData = useMemo(() => {
    const counts = data.reduce(
      (acc, curr) => ({ ...acc, [curr.area]: (acc[curr.area] || 0) + 1 }),
      {} as Record<string, number>,
    )
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
  }, [data])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-base">Observações por Tipo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full">
            <ChartContainer config={typeConfig} className="h-full w-full">
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                >
                  {typeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[entry.name] || `hsl(${(index * 137) % 360}, 70%, 50%)`}
                    />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent className="flex-wrap pt-4" />} />
              </PieChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Tendência Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full">
            <ChartContainer
              config={{
                abertos: { label: 'Comunicados abertos', color: '#f59e0b' },
                fechados: { label: 'Comunicados fechados', color: '#10b981' },
              }}
              className="h-full w-full"
            >
              <BarChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="abertos" fill="var(--color-abertos)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="fechados" fill="var(--color-fechados)" radius={[4, 4, 0, 0]} />
              </BarChart>
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
              config={{ value: { label: 'Relatos', color: '#3b82f6' } }}
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
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
