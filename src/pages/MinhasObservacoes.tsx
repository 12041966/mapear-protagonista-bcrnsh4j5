import { useEffect, useState } from 'react'
import { useMainStore } from '@/stores/main'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { DataTable } from '@/components/management/DataTable'
import { Observation } from '@/types'

export default function MinhasObservacoes() {
  const { currentUser, isSuperAdmin } = useMainStore()
  const { user } = useAuth()
  const [myObs, setMyObs] = useState<Observation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const fetchMyObs = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('observacoes')
        .select('*, profiles(name, whatsapp, cpf, email, empresa_id), empresas(nome)')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (data && !error) {
        setMyObs(
          data.map((row: any) => ({
            id: row.codigo || row.id,
            date: row.date,
            observer: {
              name: row.profiles?.name || 'Desconhecido',
              whatsapp: row.profiles?.whatsapp || '',
              cpf: row.profiles?.cpf || '',
              email: row.profiles?.email || '',
              companyId: row.profiles?.empresa_id || '',
            },
            type: row.type,
            detail: row.detail || '',
            area: row.area || '',
            shift: row.shift || '',
            riskLevel: row.risk_level || '',
            description: row.description || '',
            resolutionType: row.resolution_type || '',
            status: row.status as any,
            assignedTo: row.assigned_to,
            dueDate: row.due_date || null,
            completionDate: row.completion_date || null,
            managerComments: row.manager_comments,
            companyName: row.empresas?.nome || 'Não informada',
            justificativaCancelamento: row.justificativa_cancelamento || null,
          })),
        )
      }
      setLoading(false)
    }

    fetchMyObs()
  }, [user])

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

      {loading ? (
        <div className="flex flex-col items-center justify-center h-48 bg-white border rounded-lg shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
          <span className="text-slate-500">Carregando observações...</span>
        </div>
      ) : (
        <DataTable data={myObs} hideActions={true} onEdit={() => {}} />
      )}
    </div>
  )
}
