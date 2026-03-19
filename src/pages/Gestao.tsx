import { useState, useMemo } from 'react'
import { Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Download, Search, Filter, AlertTriangle } from 'lucide-react'
import { useMainStore } from '@/stores/main'
import { DataTable } from '@/components/management/DataTable'
import { EditSheet } from '@/components/management/EditSheet'
import { Observation } from '@/types'
import { useToast } from '@/hooks/use-toast'

export default function Gestao() {
  const { observations, currentUser, isSuperAdmin } = useMainStore()
  const [search, setSearch] = useState('')
  const [editingObs, setEditingObs] = useState<Observation | null>(null)
  const { toast } = useToast()

  const filteredData = useMemo(() => {
    return observations.filter(
      (obs) =>
        obs.id.toLowerCase().includes(search.toLowerCase()) ||
        obs.area.toLowerCase().includes(search.toLowerCase()) ||
        obs.type.toLowerCase().includes(search.toLowerCase()),
    )
  }, [observations, search])

  if (currentUser?.role === 'Observador' && !isSuperAdmin) {
    return <Navigate to="/" replace />
  }

  if (!currentUser?.companyId && !isSuperAdmin) {
    return (
      <div className="w-full max-w-7xl mx-auto py-12">
        <div className="bg-white border rounded-lg p-8 text-center shadow-sm animate-fade-in-up">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Empresa não vinculada</h2>
          <p className="text-slate-600">
            Você precisa estar vinculado a uma empresa para gerenciar os relatos da sua organização.
          </p>
        </div>
      </div>
    )
  }

  const handleExport = () => {
    toast({
      title: 'Download Iniciado',
      description: 'A planilha CSV está sendo gerada.',
    })
    setTimeout(() => {
      console.log('Exported', filteredData.length, 'records')
    }, 1000)
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Gestão de Relatos</h2>
          <p className="text-sm text-slate-500">Acompanhe e trate as observações de segurança.</p>
        </div>
        <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Gerar Planilha
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por ID, Área ou Tipo..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="secondary" className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filtros Avançados
        </Button>
      </div>

      <DataTable data={filteredData} onEdit={setEditingObs} />

      <EditSheet
        obs={editingObs}
        open={!!editingObs}
        onOpenChange={(open) => !open && setEditingObs(null)}
      />
    </div>
  )
}
