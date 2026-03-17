import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UsersList } from '@/components/settings/UsersList'
import { SystemTables } from '@/components/settings/SystemTables'

export default function Settings() {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Configurações do Sistema
        </h2>
        <p className="text-sm text-slate-500">
          Gerencie perfis de usuários e as tabelas de referência do sistema.
        </p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="users">Perfis de Usuários</TabsTrigger>
          <TabsTrigger value="tables">Tabelas do Sistema</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6 focus-visible:outline-none">
          <UsersList />
        </TabsContent>

        <TabsContent value="tables" className="mt-6 focus-visible:outline-none">
          <SystemTables />
        </TabsContent>
      </Tabs>
    </div>
  )
}
