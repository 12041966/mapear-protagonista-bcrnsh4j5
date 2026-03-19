import { useEffect, useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  PlusCircle,
  ListTodo,
  Settings as SettingsIcon,
  LogOut,
  Globe,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useMainStore } from '@/stores/main'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['Administrador', 'Supervisor'] },
  {
    name: 'Nova Observação',
    path: '/nova-observacao',
    icon: PlusCircle,
    roles: ['Administrador', 'Supervisor', 'Observador'],
  },
  {
    name: 'Minhas Observações',
    path: '/minhas-observacoes',
    icon: ListTodo,
    roles: ['Observador'],
  },
  {
    name: 'Gestão de Relatos',
    path: '/gestao',
    icon: ListTodo,
    roles: ['Administrador', 'Supervisor'],
  },
  {
    name: 'Config. Globais',
    path: '/configuracoes-globais',
    icon: Globe,
    roles: ['Administrador'],
    superAdminOnly: true,
  },
  { name: 'Configurações', path: '/settings', icon: SettingsIcon, roles: ['Administrador'] },
]

export default function Layout() {
  const location = useLocation()
  const { currentUser, isSuperAdmin, activeCompanyId, setActiveCompanyId, companies } =
    useMainStore()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [companyName, setCompanyName] = useState<string>('')

  useEffect(() => {
    if (currentUser?.companyId) {
      supabase
        .from('empresas')
        .select('nome')
        .eq('id', currentUser.companyId)
        .single()
        .then(({ data }) => {
          if (data?.nome) setCompanyName(data.nome)
        })
    }
  }, [currentUser?.companyId])

  const visibleNavItems = NAV_ITEMS.filter(
    (item) =>
      currentUser &&
      item.roles.includes(currentUser.role) &&
      (!item.superAdminOnly || isSuperAdmin),
  )

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const displayName = currentUser?.name || user?.email?.split('@')[0] || 'Usuário'
  const displayEmail = user?.email || ''

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-900">
      <aside className="hidden md:flex flex-col w-64 border-r bg-white shadow-sm z-10">
        <div className="p-6 flex flex-col border-b bg-slate-50/50">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center shadow-sm">
              <SettingsIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-primary tracking-tight">MAPEAR</span>
          </div>
          {isSuperAdmin ? (
            <div className="text-xs font-semibold text-primary truncate border-t border-slate-200/60 pt-2 mt-1">
              Plataforma Global
            </div>
          ) : companyName ? (
            <div
              className="text-xs font-semibold text-slate-600 truncate border-t border-slate-200/60 pt-2 mt-1"
              title={companyName}
            >
              {companyName}
            </div>
          ) : (
            <div className="h-4 w-32 bg-slate-200 animate-pulse rounded mt-3"></div>
          )}
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {visibleNavItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'hover:bg-slate-100 text-slate-600',
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden relative">
        <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b bg-white z-10">
          <div className="flex items-center md:hidden space-x-3">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center shadow-sm">
              <SettingsIcon className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-primary leading-none text-sm">MAPEAR</span>
              {companyName && (
                <span
                  className="text-[10px] font-medium text-slate-500 truncate max-w-[120px] mt-0.5"
                  title={companyName}
                >
                  {companyName}
                </span>
              )}
            </div>
          </div>
          <div className="hidden md:flex">
            <h1 className="text-xl font-semibold text-slate-800">
              {visibleNavItems.find((i) => i.path === location.pathname)?.name || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            {isSuperAdmin && (
              <Select value={activeCompanyId} onValueChange={setActiveCompanyId}>
                <SelectTrigger className="w-[140px] sm:w-[200px] h-9 text-xs bg-slate-100 border-none font-medium">
                  <SelectValue placeholder="Todas as empresas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="font-semibold text-primary">
                    Todas as empresas
                  </SelectItem>
                  {companies.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="font-semibold text-slate-700 hover:text-primary transition-colors cursor-pointer text-sm sm:text-base px-2 sm:px-4"
                >
                  {displayName}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1.5">
                    <p className="text-sm font-medium leading-none">{displayName}</p>
                    <p
                      className="text-xs leading-none text-muted-foreground truncate"
                      title={displayEmail}
                    >
                      {displayEmail}
                    </p>
                    {companyName && (
                      <p className="text-xs font-medium text-slate-500 mt-1 pb-1 border-b truncate">
                        {companyName}
                      </p>
                    )}
                    {currentUser?.role && (
                      <p className="text-xs mt-1 font-semibold text-primary">
                        {isSuperAdmin ? 'Super Admin' : currentUser.role}
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-600 cursor-pointer py-2 focus:text-red-700 focus:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span className="font-medium">Sair da conta</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 animate-fade-in-up">
          <Outlet />
        </main>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-white flex justify-around items-center h-16 px-2 z-50 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        {visibleNavItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full space-y-1',
                isActive ? 'text-primary' : 'text-slate-400 hover:text-slate-600',
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
