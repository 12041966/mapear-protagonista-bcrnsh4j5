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
import GlobalSettings from '@/pages/admin/GlobalSettings'

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

  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [activeCompanyId, setActiveCompanyId] = useState<string | 'all'>('all')
  const [companies, setCompanies] = useState<any[]>([])

  const [profileLoading, setProfileLoading] = useState(false)
  const [observationsLoading, setObservationsLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      setCurrentUser(null)
      setObservations([])
      setIsSuperAdmin(false)
      setCompanies([])
      setProfileLoading(false)
      setObservationsLoading(false)
      return
    }

    setProfileLoading(true)

    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      .then(({ data, error }) => {
        if (data && !error) {
          const profile = data as any
          if (profile.active === false) {
            signOut().then(() => setProfileLoading(false))
            return
          }

          const superAdmin = profile.email === 'ferbatsan@hotmail.com'
          setIsSuperAdmin(superAdmin)

          setCurrentUser({
            id: profile.id,
            name: profile.name || '',
            email: profile.email || '',
            whatsapp: profile.whatsapp || '',
            cpf: profile.cpf || '',
            companyId: profile.empresa_id || profile.company_id || '',
            registrationNumber: profile.registration_number || null,
            role: (profile.role as Role) || 'Observador',
          })

          if (superAdmin) {
            supabase
              .from('empresas')
              .select('*')
              .eq('ativa', true)
              .order('nome')
              .then((res) => {
                if (res.data) setCompanies(res.data)
              })
            if (activeCompanyId !== 'all' && !activeCompanyId) setActiveCompanyId('all')
          } else {
            setActiveCompanyId(profile.empresa_id || '')
          }
        } else {
          setCurrentUser(null)
        }
        setProfileLoading(false)
      })
  }, [user, signOut])

  useEffect(() => {
    if (!currentUser) return
    if (activeCompanyId === '' && !isSuperAdmin) {
      setObservationsLoading(false)
      return
    }

    setObservationsLoading(true)

    let obsQuery = supabase
      .from('observacoes')
      .select('*, profiles(name, whatsapp, cpf, email, empresa_id), empresas(nome)')
      .order('date', { ascending: false })

    let defQuery = supabase
      .from('tabelas_sistema_definicoes')
      .select('*')
      .order('data_criacao', { ascending: true })

    let optQuery = supabase
      .from('tabelas_sistema_opcoes')
      .select('*')
      .order('data_criacao', { ascending: true })

    let empOptQuery = supabase.from('tabelas_sistema_empresa_opcoes').select('*')

    let efQuery = supabase
      .from('efetivo_mensal')
      .select('*')
      .order('ano', { ascending: false })
      .order('mes', { ascending: false })

    if (activeCompanyId !== 'all') {
      obsQuery = obsQuery.eq('empresa_id', activeCompanyId)
      empOptQuery = empOptQuery.eq('empresa_id', activeCompanyId)
      efQuery = efQuery.eq('empresa_id', activeCompanyId)
    }

    Promise.all([obsQuery, defQuery, optQuery, empOptQuery, efQuery]).then(
      ([obsRes, defRes, optRes, empOptRes, efRes]) => {
        if (obsRes.data && !obsRes.error) {
          setObservations(
            obsRes.data.map((row: any) => ({
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
              status: row.status || 'Pendente',
              assignedTo: row.assigned_to,
              dueDate: row.due_date || null,
              completionDate: row.completion_date || null,
              managerComments: row.manager_comments,
              companyName: row.empresas?.nome || 'Não informada',
              justificativaCancelamento: row.justificativa_cancelamento || null,
            })),
          )
        }

        const newSettings = { ...INITIAL_SETTINGS }

        if (defRes.data && optRes.data) {
          const customValues = new Map()
          if (empOptRes.data) {
            empOptRes.data.forEach((co: any) => {
              customValues.set(co.opcao_id, co.valor_customizado)
            })
          }

          const buildList = (chave: string) => {
            const def = defRes.data.find((d: any) => d.chave === chave)
            if (!def) return []
            const opts = optRes.data.filter((o: any) => o.tabela_id === def.id)
            return opts.map((o: any) => customValues.get(o.id) || o.valor_padrao)
          }

          const areas = buildList('areas')
          if (areas.length > 0) newSettings.areas = areas

          const shifts = buildList('shifts')
          if (shifts.length > 0) newSettings.shifts = shifts

          const risks = buildList('risks')
          if (risks.length > 0) newSettings.risks = risks

          const conditions = buildList('conditions')
          if (conditions.length > 0) newSettings.conditions = conditions

          const behaviors = buildList('behaviors')
          if (behaviors.length > 0) newSettings.behaviors = behaviors

          const obsTypesStr = buildList('observationTypes')
          if (obsTypesStr.length > 0) {
            newSettings.observationTypes = obsTypesStr.map((s: string) => {
              try {
                return JSON.parse(s)
              } catch (e) {
                return s
              }
            })
          }
        }

        if (efRes.data) {
          const hc: Record<string, number> = {}
          efRes.data.forEach((e: any) => {
            const mStr = String(e.mes).padStart(2, '0')
            hc[`${e.ano}-${mStr}`] = e.quantidade_funcionarios
          })
          newSettings.monthlyHeadcount = hc
        }

        setSettings(newSettings)
        setObservationsLoading(false)
      },
    )
  }, [activeCompanyId, currentUser, isSuperAdmin])

  const addObservation = useCallback(
    async (obs: any) => {
      const targetCompany =
        isSuperAdmin && activeCompanyId !== 'all' ? activeCompanyId : currentUser?.companyId
      if (!targetCompany || !user?.id) return

      const targetUserId = obs.observerId || user.id
      const currentYear = new Date().getFullYear()
      const date = new Date().toISOString()

      let success = false
      let attempts = 0
      let data = null
      let lastError = null

      while (!success && attempts < 15) {
        try {
          // Busca de forma atômica o próximo número da sequência no banco de dados para evitar condições de corrida (race conditions)
          const { data: seqData, error: seqError } = await supabase.rpc('get_next_sequence_value', {
            p_empresa_id: targetCompany,
            p_tipo: `observacao_${currentYear}`,
          })

          if (seqError) throw seqError

          const nextNum = seqData as number
          const newCode = `OBS-${currentYear}-${String(nextNum).padStart(3, '0')}`

          const res = await supabase
            .from('observacoes')
            .insert({
              codigo: newCode,
              empresa_id: targetCompany,
              user_id: targetUserId,
              date,
              type: obs.type,
              detail: obs.detail,
              area: obs.area,
              shift: obs.shift,
              risk_level: obs.riskLevel || null,
              description: obs.description,
              resolution_type: obs.resolutionType,
              status: 'Pendente',
            })
            .select('*, profiles(name, whatsapp, cpf, email, empresa_id), empresas(nome)')
            .single()

          if (res.error) {
            lastError = res.error
            if (res.error.code === '23505') {
              attempts++
            } else {
              console.error('Erro ao inserir observacao:', res.error)
              throw new Error(res.error.message)
            }
          } else {
            data = res.data
            success = true
          }
        } catch (e: any) {
          lastError = e
          attempts++
        }
      }

      if (!success || !data) {
        console.error('Falha ao criar observação após várias tentativas:', lastError)
        throw new Error(
          'Não foi possível gerar um código único para a observação. Tente novamente.',
        )
      }

      setObservations((prev) => [
        {
          id: data.codigo,
          date: data.date,
          observer: {
            name: data.profiles?.name || currentUser?.name || '',
            whatsapp: data.profiles?.whatsapp || currentUser?.whatsapp || '',
            cpf: data.profiles?.cpf || currentUser?.cpf || '',
            email: data.profiles?.email || obs.observer?.email || currentUser?.email || '',
            companyId: data.profiles?.empresa_id || targetCompany,
          },
          type: data.type,
          detail: data.detail || '',
          area: data.area || '',
          shift: data.shift || '',
          riskLevel: data.risk_level || '',
          description: data.description || '',
          resolutionType: data.resolution_type || '',
          status: data.status as any,
          assignedTo: data.assigned_to,
          dueDate: data.due_date || null,
          completionDate: data.completion_date || null,
          managerComments: data.manager_comments,
          companyName: data.empresas?.nome || 'Não informada',
          justificativaCancelamento: data.justificativa_cancelamento || null,
        },
        ...prev,
      ])
    },
    [currentUser, user, isSuperAdmin, activeCompanyId],
  )

  const updateObservation = useCallback(async (id: string, updates: Partial<Observation>) => {
    const dbUpdates: any = {}
    if (updates.status) dbUpdates.status = updates.status
    if (updates.assignedTo !== undefined) dbUpdates.assigned_to = updates.assignedTo
    if ((updates as any).managerComments !== undefined)
      dbUpdates.manager_comments = (updates as any).managerComments
    if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate
    if (updates.completionDate !== undefined) dbUpdates.completion_date = updates.completionDate
    if ((updates as any).justificativa_status !== undefined)
      dbUpdates.justificativa_status = (updates as any).justificativa_status
    if (updates.justificativaCancelamento !== undefined)
      dbUpdates.justificativa_cancelamento = updates.justificativaCancelamento

    const { error } = await supabase.from('observacoes').update(dbUpdates).eq('codigo', id)
    if (!error) {
      setObservations((prev) => prev.map((obs) => (obs.id === id ? { ...obs, ...updates } : obs)))
    }
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
        <p className="text-sm font-medium">Carregando dados...</p>
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
        isSuperAdmin,
        activeCompanyId,
        setActiveCompanyId,
        companies,
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
                <Route path="/usuarios" element={<Navigate to="/settings" replace />} />
                <Route path="/configuracoes-globais" element={<GlobalSettings />} />
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
