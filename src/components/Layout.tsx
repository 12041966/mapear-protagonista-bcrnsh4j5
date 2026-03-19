import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  PlusCircle,
  ListTodo,
  Settings as SettingsIcon,
  Bell,
  QrCode,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useMainStore } from '@/stores/main'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/use-auth'

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
  { name: 'Configurações', path: '/settings', icon: SettingsIcon, roles: ['Administrador'] },
]

export default function Layout() {
  const location = useLocation()
  const { currentUser } = useMainStore()
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const visibleNavItems = NAV_ITEMS.filter(
    (item) => currentUser && item.roles.includes(currentUser.role),
  )

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-900">
      <aside className="hidden md:flex flex-col w-64 border-r bg-white shadow-sm z-10">
        <div className="p-6 flex items-center space-x-3 border-b">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
            <SettingsIcon className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-primary">MAPEAR</span>
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
                    ? 'bg-primary text-primary-foreground'
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
          <div className="flex items-center md:hidden space-x-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <SettingsIcon className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-primary">MAPEAR</span>
          </div>
          <div className="hidden md:flex">
            <h1 className="text-xl font-semibold text-slate-800">
              {visibleNavItems.find((i) => i.path === location.pathname)?.name || 'MAPEAR'}
            </h1>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-700">
                  <QrCode className="w-5 h-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-center">Acesso Rápido Mobile</DialogTitle>
                  <DialogDescription className="text-center">
                    Escaneie o QR Code com a câmera do celular para relatar uma observação.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-center py-6">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://cultura-de-seguranca-saas-2751a.goskip.app"
                    alt="QR Code"
                    className="w-48 h-48 rounded-lg shadow-sm border border-slate-200 p-2"
                  />
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="ghost" size="icon" className="relative text-slate-500">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border cursor-pointer hover:ring-2 ring-primary transition-all">
                  <img
                    src={`https://img.usecurling.com/ppl/thumbnail?gender=female&seed=${currentUser?.id || 1}`}
                    alt="User"
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{currentUser?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {currentUser?.role}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
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
