import { useState, useCallback, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { StoreContext } from '@/stores/main'
import { INITIAL_SETTINGS, INITIAL_USERS } from '@/lib/constants'
import { Observation, UserProfile, AppSettings, Role } from '@/types'
import { AuthProvider, useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

import Layout from '@/components/Layout'
import Index from '@/pages/Index'
import NovaObservacao from '@/pages/NovaObservacao'
import MinhasObservacoes from '@/pages/MinhasObservacoes'
import Gestao from '@/pages/Gestao'
import Settings from '@/pages/Settings'
import NotFound from '@/pages/NotFound'
import Login from '@/pages/Login'
import Empresas from '@/pages/admin/Empresas'
import Usuarios from '@/pages/Usuarios'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

const StoreProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading, signOut } = useAuth()
  const [observations, setObservations] = useState<Observation[]>([])
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS)
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)

  const [profileLoading, setProfileLoading] = useState(false)
  const [observationsLoading, setObservationsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setProfileLoading(true)
      setObservationsLoading(true)

      supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
        .then(({ data, error }) => {
          if (data && !error) {
            const profile = data as any
            if (profile.active === false) {
              signOut().then(() => {
                setProfileLoading(false)
                setObservationsLoading(false)
              })
              return
            }
            setCurrentUser({
              id: profile.id,
              name: profile.name || '',
              whatsapp: profile.whatsapp || '',
              cpf: profile.cpf || '',
              companyId: profile.empresa_id || profile.company_id || '',
              registrationNumber: profile.registration_number || null,
              role: (profile.role as Role) || 'Observador',
            })

            if (profile.empresa_id) {
              supabase
                .from('observacoes')
                .select('*, profiles(name, whatsapp, cpf, empresa_id)')
                .eq('empresa_id', profile.empresa_id)
                .order('date', { ascending: false })
                .then(({ data: obsData, error: obsErr }) => {
                  if (obsData && !obsErr) {
                    const mapped = obsData.map((row: any) => ({
                      id: row.codigo || row.id,
                      date: row.date,
                      observer: {
                        name: row.profiles?.name || 'Desconhecido',
                        whatsapp: row.profiles?.whatsapp || '',
                        cpf: row.profiles?.cpf || '',
                        companyId: row.profiles?.empresa_id || '',
                      },
                      type: row.type,
                      detail: row.detail || '',
                      area: row.area || '',
                      shift: row.shift || '',
                      riskLevel: row.risk_level || '',
                      description: row.description || '',
                      resolutionType: row.resolution_type || '',
                      status: row.status || 'Pendente',
                      assignedTo: row.assigned_to,
                    }))
                    setObservations(mapped)
                  }
                  setObservationsLoading(false)
                })
            } else {
              setObservationsLoading(false)
            }
          } else {
            setCurrentUser(null)
            setObservationsLoading(false)
          }
          setProfileLoading(false)
        })
    } else {
      setCurrentUser(null)
      setObservations([])
      setProfileLoading(false)
      setObservationsLoading(false)
    }
  }, [user, signOut])

  const addObservation = useCallback(
    (obs: Omit<Observation, 'id' | 'date' | 'status'>) => {
      const newObs: Observation = {
        ...obs,
        id: `OBS-${new Date().getFullYear()}-${String(observations.length + 1).padStart(3, '0')}`,
        date: new Date().toISOString(),
        status: 'Pendente',
      }
      setObservations((prev) => [newObs, ...prev])
    },
    [observations.length],
  )

  const updateObservation = useCallback((id: string, updates: Partial<Observation>) => {
    setObservations((prev) => prev.map((obs) => (obs.id === id ? { ...obs, ...updates } : obs)))
  }, [])

  const addUser = useCallback((u: UserProfile) => setUsers((prev) => [...prev, u]), [])
  const updateUser = useCallback((id: string, updates: Partial<UserProfile>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)))
  }, [])
  const removeUser = useCallback(
    (id: string) => setUsers((prev) => prev.filter((u) => u.id !== id)),
    [],
  )
  const updateSettings = useCallback((newSettings: AppSettings) => setSettings(newSettings), [])

  if (authLoading || profileLoading || observationsLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-medium">Carregando dados da empresa...</p>
      </div>
    )
  }

  return (
    <StoreContext.Provider
      value={{
        observations,
        addObservation,
        updateObservation,
        users,
        addUser,
        updateUser,
        removeUser,
        settings,
        updateSettings,
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

const App = () => {
  return (
    <AuthProvider>
      <StoreProviderWrapper>
        <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route path="/" element={<Index />} />
                <Route path="/nova-observacao" element={<NovaObservacao />} />
                <Route path="/minhas-observacoes" element={<MinhasObservacoes />} />
                <Route path="/gestao" element={<Gestao />} />
                <Route path="/usuarios" element={<Usuarios />} />
                <Route path="/admin/empresas" element={<Empresas />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </BrowserRouter>
      </StoreProviderWrapper>
    </AuthProvider>
  )
}

export default App
