import { Navigate } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UsersList } from '@/components/settings/UsersList'
import { SystemTables } from '@/components/settings/SystemTables'
import { HeadcountSettings } from '@/components/settings/HeadcountSettings'
import { useMainStore } from '@/stores/main'
import { AlertTriangle } from 'lucide-react'

export default function Settings() {
  const { currentUser, isSuperAdmin, activeCompanyId } = useMainStore()

  if (currentUser?.role !== 'Administrador' && !isSuperAdmin) {
    return <Navigate to="/" replace />
  }

  if (isSuperAdmin && activeCompanyId === 'all') {
    return (
      <div className="w-full max-w-6xl mx-auto py-12">
        <div className="bg-white border rounded-lg p-8 text-center shadow-sm animate-fade-in-up">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Selecione uma Empresa</h2>
          <p className="text-slate-600 max-w-md mx-auto">
            Para gerenciar tabelas e configurações, selecione uma empresa específica no seletor do
            topo da página.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Configurações do Sistema
        </h2>
        <p className="text-sm text-slate-500">
          Gerencie acessos administrativos, indicadores e tabelas de referência.
        </p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="users">Gestão de Perfis</TabsTrigger>
          <TabsTrigger value="headcount">Efetivo Mensal</TabsTrigger>
          <TabsTrigger value="tables">Tabelas do Sistema</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6 focus-visible:outline-none">
          <UsersList />
        </TabsContent>

        <TabsContent value="headcount" className="mt-6 focus-visible:outline-none">
          <HeadcountSettings />
        </TabsContent>

        <TabsContent value="tables" className="mt-6 focus-visible:outline-none">
          <SystemTables />
        </TabsContent>
      </Tabs>
    </div>
  )
}
