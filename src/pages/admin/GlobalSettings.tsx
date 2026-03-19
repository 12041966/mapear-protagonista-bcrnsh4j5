import { useState, useEffect, useCallback } from 'react'
import { Navigate } from 'react-router-dom'
import { Globe, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMainStore } from '@/stores/main'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { EmpresasTable } from '@/components/admin/EmpresasTable'
import { EmpresaModal } from '@/components/admin/EmpresaModal'
import { EmpresaQrModal } from '@/components/admin/EmpresaQrModal'
import { CompanyAdmins } from '@/components/admin/CompanyAdmins'
import { Tables } from '@/lib/supabase/types'

type Empresa = Tables<'empresas'>

export default function GlobalSettings() {
  const { isSuperAdmin } = useMainStore()
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEmpresa, setEditingEmpresa] = useState<Empresa | null>(null)
  const [qrEmpresa, setQrEmpresa] = useState<Empresa | null>(null)
  const { toast } = useToast()

  const fetchEmpresas = useCallback(async () => {
    if (!isSuperAdmin) return
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
  }, [toast, isSuperAdmin])

  useEffect(() => {
    fetchEmpresas()
  }, [fetchEmpresas])

  if (!isSuperAdmin) {
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

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Globe className="w-6 h-6 text-primary" />
          Configurações Globais
        </h2>
        <p className="text-sm text-slate-500">
          Gerencie as organizações ativas na plataforma e seus respectivos administradores.
        </p>
      </div>

      <Tabs defaultValue="empresas" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="empresas">Empresas</TabsTrigger>
          <TabsTrigger value="admins">Administradores</TabsTrigger>
        </TabsList>

        <TabsContent value="empresas" className="mt-6 focus-visible:outline-none space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-500">Cadastre e gerencie as organizações ativas.</p>
            <Button
              onClick={() => {
                setEditingEmpresa(null)
                setIsModalOpen(true)
              }}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Nova Empresa
            </Button>
          </div>
          <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
            <EmpresasTable
              data={empresas}
              isLoading={loading}
              onEdit={(e) => {
                setEditingEmpresa(e)
                setIsModalOpen(true)
              }}
              onToggleStatus={handleToggleStatus}
              onQrCode={(e) => setQrEmpresa(e)}
            />
          </div>
        </TabsContent>

        <TabsContent value="admins" className="mt-6 focus-visible:outline-none">
          <CompanyAdmins />
        </TabsContent>
      </Tabs>

      <EmpresaModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        empresa={editingEmpresa}
        onSuccess={fetchEmpresas}
      />

      <EmpresaQrModal
        open={!!qrEmpresa}
        onOpenChange={(open) => !open && setQrEmpresa(null)}
        empresa={qrEmpresa}
      />
    </div>
  )
}
