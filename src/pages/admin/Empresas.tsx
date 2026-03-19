import { useState, useEffect, useCallback } from 'react'
import { Navigate } from 'react-router-dom'
import { Plus, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMainStore } from '@/stores/main'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { EmpresasTable } from '@/components/admin/EmpresasTable'
import { EmpresaModal } from '@/components/admin/EmpresaModal'
import { Tables } from '@/lib/supabase/types'

type Empresa = Tables<'empresas'>

export default function Empresas() {
  const { currentUser } = useMainStore()
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEmpresa, setEditingEmpresa] = useState<Empresa | null>(null)
  const { toast } = useToast()

  const fetchEmpresas = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.from('empresas').select('*').order('nome')

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível carregar as empresas.',
      })
    } else {
      setEmpresas(data || [])
    }
    setLoading(false)
  }, [toast])

  useEffect(() => {
    if (currentUser?.role === 'Administrador') {
      fetchEmpresas()
    }
  }, [currentUser, fetchEmpresas])

  if (currentUser?.role !== 'Administrador') {
    return <Navigate to="/" replace />
  }

  const handleToggleStatus = async (empresa: Empresa) => {
    const { error } = await supabase
      .from('empresas')
      .update({ ativa: !empresa.ativa })
      .eq('id', empresa.id)

    if (error) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Falha ao alterar status.' })
    } else {
      toast({
        title: 'Sucesso',
        description: `Empresa ${!empresa.ativa ? 'ativada' : 'desativada'} com sucesso.`,
      })
      setEmpresas((prev) => prev.map((e) => (e.id === empresa.id ? { ...e, ativa: !e.ativa } : e)))
    }
  }

  const handleEdit = (empresa: Empresa) => {
    setEditingEmpresa(empresa)
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setEditingEmpresa(null)
    setIsModalOpen(true)
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary" />
            Gestão de Empresas
          </h2>
          <p className="text-sm text-slate-500">
            Cadastre e gerencie as organizações ativas na plataforma.
          </p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          Nova Empresa
        </Button>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
        <EmpresasTable
          data={empresas}
          isLoading={loading}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
        />
      </div>

      <EmpresaModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        empresa={editingEmpresa}
        onSuccess={fetchEmpresas}
      />
    </div>
  )
}
