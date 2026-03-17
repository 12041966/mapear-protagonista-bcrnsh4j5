import { Navigate } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UsersList } from '@/components/settings/UsersList'
import { SystemTables } from '@/components/settings/SystemTables'
import { HeadcountSettings } from '@/components/settings/HeadcountSettings'
import { useMainStore } from '@/stores/main'

export default function Settings() {
  const { currentUser } = useMainStore()

  if (currentUser?.role !== 'Segurança') {
    return <Navigate to="/" replace />
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
