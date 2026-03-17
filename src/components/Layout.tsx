import { Outlet, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, PlusCircle, ListTodo, Settings, Bell, QrCode } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog'

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Nova Observação', path: '/nova-observacao', icon: PlusCircle },
  { name: 'Gestão de Relatos', path: '/gestao', icon: ListTodo },
  { name: 'Configurações', path: '/settings', icon: Settings },
]

export default function Layout() {
  const location = useLocation()

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-900">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-white shadow-sm z-10">
        <div className="p-6 flex items-center space-x-3 border-b">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-primary">MAPEAR</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
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
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b bg-white z-10">
          <div className="flex items-center md:hidden space-x-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <Settings className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-primary">MAPEAR</span>
          </div>
          <div className="hidden md:flex">
            <h1 className="text-xl font-semibold text-slate-800">
              {NAV_ITEMS.find((i) => i.path === location.pathname)?.name || 'Dashboard'}
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
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border">
              <img src="https://img.usecurling.com/ppl/thumbnail?gender=female&seed=1" alt="User" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 animate-fade-in-up">
          <Outlet />
        </main>
      </div>

      {/* Bottom Nav Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-white flex justify-around items-center h-16 px-2 z-50 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        {NAV_ITEMS.map((item) => {
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
