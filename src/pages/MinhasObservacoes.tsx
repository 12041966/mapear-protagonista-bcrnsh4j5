import { useEffect, useMemo } from 'react'
import { useMainStore } from '@/stores/main'
import { AlertTriangle } from 'lucide-react'
import { DataTable } from '@/components/management/DataTable'

export default function MinhasObservacoes() {
  const { currentUser, isSuperAdmin, observations, refreshObservations } = useMainStore()

  useEffect(() => {
    refreshObservations?.()
  }, [refreshObservations])

  const myObs = useMemo(() => {
    if (!currentUser) return []
    return observations.filter((obs: any) => obs.userId === currentUser.id)
  }, [observations, currentUser])

  if (!currentUser?.companyId && !isSuperAdmin) {
    return (
      <div className="w-full max-w-7xl mx-auto py-12">
        <div className="bg-white border rounded-lg p-8 text-center shadow-sm animate-fade-in-up">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Empresa não vinculada</h2>
          <p className="text-slate-600">
            Você precisa estar vinculado a uma empresa para visualizar e gerenciar observações.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Minhas Observações</h2>
        <p className="text-sm text-slate-500">Acompanhe o status e as ações dos seus relatos.</p>
      </div>

      <DataTable data={myObs} hideActions={true} onEdit={() => {}} />
    </div>
  )
}
