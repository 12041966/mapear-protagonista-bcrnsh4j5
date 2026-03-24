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

const RISK_CHART_COLORS: Record<string, string> = {
  Leve: '#10b981',
  Moderado: '#f59e0b',
  Grave: '#ea580c',
  'Muito Grave': '#ef4444',
}

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  if (percent < 0.05) return null

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

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

  const riskData = useMemo(() => {
    const counts = data.reduce(
      (acc, curr) => ({
        ...acc,
        [curr.riskLevel || 'Não Informado']: (acc[curr.riskLevel || 'Não Informado'] || 0) + 1,
      }),
      {} as Record<string, number>,
    )
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [data])

  const riskConfig = useMemo(() => {
    return riskData.reduce((acc, d) => {
      acc[d.name] = {
        label: d.name,
        color: RISK_CHART_COLORS[d.name] || '#94a3b8',
      }
      return acc
    }, {} as ChartConfig)
  }, [riskData])

  const trendData = useMemo(() => {
    const grouped = data.reduce(
      (acc, obs) => {
        const d = new Date(obs.date)
        const rawMonth = d.toLocaleString('pt-BR', { month: 'short' }).replace('.', '')
        const month = rawMonth.charAt(0).toUpperCase() + rawMonth.slice(1)
        const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`

        if (!acc[key]) acc[key] = { name: month, abertos: 0, fechados: 0, sortKey: key }

        if (obs.status === 'Concluído' || obs.status === 'Cancelada') {
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
      (acc, curr) => ({
        ...acc,
        [curr.area || 'Não Informada']: (acc[curr.area || 'Não Informada'] || 0) + 1,
      }),
      {} as Record<string, number>,
    )
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
  }, [data])

  const detailData = useMemo(() => {
    const grouped = data.reduce(
      (acc, obs) => {
        const detail = obs.detail || 'Não Informado'
        if (!acc[detail]) {
          acc[detail] = { name: detail, abertos: 0, concluidos: 0, total: 0 }
        }
        if (obs.status === 'Concluído' || obs.status === 'Cancelada') {
          acc[detail].concluidos++
        } else {
          acc[detail].abertos++
        }
        acc[detail].total++
        return acc
      },
      {} as Record<string, any>,
    )

    return Object.values(grouped)
      .sort((a, b) => b.total - a.total)
      .slice(0, 7) // limit to top 7
  }, [data])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
      {/* 1. Tipo */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-base">Por Tipo</CardTitle>
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
                  outerRadius={80}
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

      {/* 2. Risco */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-base">Por Grau de Risco</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full">
            <ChartContainer config={riskConfig} className="h-full w-full">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="45%"
                  innerRadius={0}
                  outerRadius={80}
                  dataKey="value"
                  nameKey="name"
                  labelLine={false}
                  label={renderCustomizedLabel}
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={RISK_CHART_COLORS[entry.name] || '#94a3b8'} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent className="flex-wrap pt-4" />} />
              </PieChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* 3. Trend */}
      <Card className="col-span-1 md:col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-base">Tendência Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full">
            <ChartContainer
              config={{
                abertos: { label: 'Abertos', color: '#f59e0b' },
                fechados: { label: 'Resolvidos', color: '#10b981' },
              }}
              className="h-full w-full"
            >
              <BarChart data={trendData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
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

      {/* 4. Area */}
      <Card className="col-span-1 md:col-span-1 lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-base">Por Área (Top 5)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full">
            <ChartContainer
              config={{ value: { label: 'Relatos', color: '#3b82f6' } }}
              className="h-full w-full"
            >
              <BarChart data={areaData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
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

      {/* 5. Detalhamento (Stacked Bar) */}
      <Card className="col-span-1 md:col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Por Detalhamento (Top 7)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full">
            <ChartContainer
              config={{
                abertos: { label: 'Abertos', color: '#f59e0b' },
                concluidos: { label: 'Resolvidos', color: '#10b981' },
              }}
              className="h-full w-full"
            >
              <BarChart
                data={detailData}
                layout="vertical"
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  vertical={true}
                  stroke="#e2e8f0"
                />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={160}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="concluidos"
                  stackId="a"
                  fill="var(--color-concluidos)"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="abertos"
                  stackId="a"
                  fill="var(--color-abertos)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
