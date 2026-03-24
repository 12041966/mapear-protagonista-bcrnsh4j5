import { useState, useMemo, useEffect } from 'react'
import { useMainStore } from '@/stores/main'
import { MetricsCards } from '@/components/dashboard/MetricsCards'
import { DashboardCharts } from '@/components/dashboard/Charts'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { Button } from '@/components/ui/button'
import { Filter, X } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

export default function Index() {
  const { observations, settings, currentUser, isSuperAdmin, refreshObservations } = useMainStore()

  useEffect(() => {
    refreshObservations?.()
  }, [refreshObservations])

  const [selectedYears, setSelectedYears] = useState<string[]>([])
  const [selectedMonths, setSelectedMonths] = useState<string[]>([])
  const [selectedAreas, setSelectedAreas] = useState<string[]>([])
  const [selectedShifts, setSelectedShifts] = useState<string[]>([])

  const availableYears = useMemo(() => {
    const years = new Set(observations.map((o) => new Date(o.date).getFullYear().toString()))
    return Array.from(years).sort().reverse()
  }, [observations])

  const availableMonths = [
    { value: '0', label: 'Janeiro' },
    { value: '1', label: 'Fevereiro' },
    { value: '2', label: 'Março' },
    { value: '3', label: 'Abril' },
    { value: '4', label: 'Maio' },
    { value: '5', label: 'Junho' },
    { value: '6', label: 'Julho' },
    { value: '7', label: 'Agosto' },
    { value: '8', label: 'Setembro' },
    { value: '9', label: 'Outubro' },
    { value: '10', label: 'Novembro' },
    { value: '11', label: 'Dezembro' },
  ]

  const availableAreas = settings.areas || []
  const availableShifts = settings.shifts || []

  const filteredObservations = useMemo(() => {
    return observations.filter((obs) => {
      const d = new Date(obs.date)
      const year = d.getFullYear().toString()
      const month = d.getMonth().toString()

      if (selectedYears.length > 0 && !selectedYears.includes(year)) return false
      if (selectedMonths.length > 0 && !selectedMonths.includes(month)) return false
      if (selectedAreas.length > 0 && !selectedAreas.includes(obs.area)) return false
      if (selectedShifts.length > 0 && !selectedShifts.includes(obs.shift)) return false

      return true
    })
  }, [observations, selectedYears, selectedMonths, selectedAreas, selectedShifts])

  const hasFilters =
    selectedYears.length > 0 ||
    selectedMonths.length > 0 ||
    selectedAreas.length > 0 ||
    selectedShifts.length > 0

  if (!currentUser?.companyId && !isSuperAdmin) {
    return (
      <div className="w-full max-w-7xl mx-auto py-12">
        <div className="bg-white border rounded-lg p-8 text-center shadow-sm animate-fade-in-up">
          <Filter className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Empresa não vinculada</h2>
          <p className="text-slate-600">
            Você precisa estar vinculado a uma empresa para visualizar o dashboard.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h2>
          <p className="text-sm text-slate-500">Visão geral e indicadores de segurança.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex items-center text-slate-500 mr-2">
          <Filter className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">Filtros:</span>
        </div>

        {/* Years */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 border-dashed relative">
              Ano
              {selectedYears.length > 0 && (
                <Badge variant="secondary" className="ml-2 px-1 rounded-sm text-xs font-normal">
                  {selectedYears.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[150px]">
            {availableYears.map((y) => (
              <DropdownMenuCheckboxItem
                key={y}
                checked={selectedYears.includes(y)}
                onCheckedChange={(c) => {
                  setSelectedYears((prev) => (c ? [...prev, y] : prev.filter((x) => x !== y)))
                }}
              >
                {y}
              </DropdownMenuCheckboxItem>
            ))}
            {availableYears.length === 0 && (
              <div className="px-2 py-2 text-sm text-slate-500">Sem dados</div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Months */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 border-dashed relative">
              Mês
              {selectedMonths.length > 0 && (
                <Badge variant="secondary" className="ml-2 px-1 rounded-sm text-xs font-normal">
                  {selectedMonths.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[200px]">
            <ScrollArea className="h-64">
              {availableMonths.map((m) => (
                <DropdownMenuCheckboxItem
                  key={m.value}
                  checked={selectedMonths.includes(m.value)}
                  onCheckedChange={(c) => {
                    setSelectedMonths((prev) =>
                      c ? [...prev, m.value] : prev.filter((x) => x !== m.value),
                    )
                  }}
                >
                  {m.label}
                </DropdownMenuCheckboxItem>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Areas */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 border-dashed relative">
              Área
              {selectedAreas.length > 0 && (
                <Badge variant="secondary" className="ml-2 px-1 rounded-sm text-xs font-normal">
                  {selectedAreas.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[220px]">
            <ScrollArea className="h-64">
              {availableAreas.map((a) => (
                <DropdownMenuCheckboxItem
                  key={a}
                  checked={selectedAreas.includes(a)}
                  onCheckedChange={(c) => {
                    setSelectedAreas((prev) => (c ? [...prev, a] : prev.filter((x) => x !== a)))
                  }}
                >
                  {a}
                </DropdownMenuCheckboxItem>
              ))}
              {availableAreas.length === 0 && (
                <div className="px-2 py-2 text-sm text-slate-500">Nenhuma área</div>
              )}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Shifts */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 border-dashed relative">
              Turno
              {selectedShifts.length > 0 && (
                <Badge variant="secondary" className="ml-2 px-1 rounded-sm text-xs font-normal">
                  {selectedShifts.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[180px]">
            {availableShifts.map((s) => (
              <DropdownMenuCheckboxItem
                key={s}
                checked={selectedShifts.includes(s)}
                onCheckedChange={(c) => {
                  setSelectedShifts((prev) => (c ? [...prev, s] : prev.filter((x) => x !== s)))
                }}
              >
                {s}
              </DropdownMenuCheckboxItem>
            ))}
            {availableShifts.length === 0 && (
              <div className="px-2 py-2 text-sm text-slate-500">Nenhum turno</div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 text-slate-500 px-2"
            onClick={() => {
              setSelectedYears([])
              setSelectedMonths([])
              setSelectedAreas([])
              setSelectedShifts([])
            }}
          >
            <X className="w-4 h-4 mr-1" />
            Limpar
          </Button>
        )}
      </div>

      <MetricsCards data={filteredObservations} />
      <DashboardCharts data={filteredObservations} />
      <RecentActivity data={filteredObservations} />
    </div>
  )
}
