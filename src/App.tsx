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
import Cadastro from '@/pages/Cadastro'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

const StoreProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading, signOut } = useAuth()
  const [observations, setObservations] = useState<any[]>([])
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

  const refreshObservations = useCallback(async () => {
    if (!currentUser) return
    if (activeCompanyId === '' && !isSuperAdmin) return

    let obsQuery = supabase
      .from('observacoes')
      .select('*, profiles(name, whatsapp, cpf, email, empresa_id), empresas(nome)')
      .order('date', { ascending: false })

    if (activeCompanyId !== 'all') {
      obsQuery = obsQuery.eq('empresa_id', activeCompanyId)
    }

    const { data, error } = await obsQuery
    if (data && !error) {
      setObservations(
        data.map((row: any) => ({
          id: row.codigo || row.id,
          userId: row.user_id,
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
  }, [activeCompanyId, currentUser, isSuperAdmin])

  useEffect(() => {
    if (!currentUser) return
    if (activeCompanyId === '' && !isSuperAdmin) {
      setObservationsLoading(false)
      return
    }

    setObservationsLoading(true)

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
      optQuery = optQuery.or(`empresa_id.is.null,empresa_id.eq.${activeCompanyId}`)
      empOptQuery = empOptQuery.eq('empresa_id', activeCompanyId)
      efQuery = efQuery.eq('empresa_id', activeCompanyId)
    } else {
      optQuery = optQuery.is('empresa_id', null)
    }

    Promise.all([refreshObservations(), defQuery, optQuery, empOptQuery, efQuery]).then(
      ([_, defRes, optRes, empOptRes, efRes]) => {
        const newSettings = { ...INITIAL_SETTINGS }

        if (defRes.data && optRes.data) {
          const customValues = new Map()
          const hiddenOptions = new Set()
          if (empOptRes.data) {
            empOptRes.data.forEach((co: any) => {
              if (co.valor_customizado) {
                customValues.set(co.opcao_id, co.valor_customizado)
              }
              if (co.oculto) {
                hiddenOptions.add(co.opcao_id)
              }
            })
          }

          const buildList = (chave: string) => {
            const def = defRes.data.find((d: any) => d.chave === chave)
            if (!def) return []
            let opts = optRes.data.filter((o: any) => o.tabela_id === def.id)

            const getOrder = (id: string, defaultOrder: number) => {
              if (!empOptRes.data) return defaultOrder ?? 0
              const custom = empOptRes.data.find((co: any) => co.opcao_id === id)
              return custom?.ordem ?? defaultOrder ?? 0
            }

            opts = opts.sort((a: any, b: any) => {
              const orderA = getOrder(a.id, a.ordem)
              const orderB = getOrder(b.id, b.ordem)
              if (orderA === orderB) {
                return new Date(a.data_criacao).getTime() - new Date(b.data_criacao).getTime()
              }
              return orderA - orderB
            })

            return opts
              .filter((o: any) => !hiddenOptions.has(o.id))
              .map((o: any) => customValues.get(o.id) || o.valor_padrao)
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
  }, [activeCompanyId, currentUser, isSuperAdmin, refreshObservations])

  useEffect(() => {
    if (!currentUser) return

    const channel = supabase
      .channel('realtime_observacoes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'observacoes' },
        async (payload) => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            const { data, error } = await supabase
              .from('observacoes')
              .select('*, profiles(name, whatsapp, cpf, email, empresa_id), empresas(nome)')
              .eq('id', payload.new.id)
              .single()

            if (data && !error) {
              setObservations((prev) => {
                const mapped = {
                  id: data.codigo || data.id,
                  userId: data.user_id,
                  date: data.date,
                  observer: {
                    name: data.profiles?.name || 'Desconhecido',
                    whatsapp: data.profiles?.whatsapp || '',
                    cpf: data.profiles?.cpf || '',
                    email: data.profiles?.email || '',
                    companyId: data.profiles?.empresa_id || '',
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
                }

                if (activeCompanyId !== 'all' && mapped.observer.companyId !== activeCompanyId) {
                  return prev
                }

                const exists = prev.some((o) => o.id === mapped.id)
                if (exists) {
                  return prev.map((o) => (o.id === mapped.id ? mapped : o))
                }

                return [mapped, ...prev].sort(
                  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
                )
              })
            }
          } else if (payload.eventType === 'DELETE') {
            setObservations((prev) =>
              prev.filter((o) => o.id !== (payload.old as any).codigo && o.id !== payload.old.id),
            )
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUser, activeCompanyId])

  const addObservation = useCallback(
    async (obs: any) => {
      const targetCompany =
        isSuperAdmin && activeCompanyId !== 'all' ? activeCompanyId : currentUser?.companyId
      if (!targetCompany || !user?.id) return

      const targetUserId = obs.observerId || user.id
      const date = new Date().toISOString()

      let success = false
      let attempts = 0
      let data = null
      let lastError = null

      let initialStatus = 'Pendente'
      let completionDate = null
      if (
        obs.type &&
        obs.type.toLowerCase().includes('comportamento') &&
        obs.resolutionType === 'Feedback fornecido'
      ) {
        initialStatus = 'Concluído'
        completionDate = date
      }

      while (!success && attempts < 5) {
        try {
          const { data: edgeData, error: edgeError } = await supabase.functions.invoke(
            'gerar_codigo_observacao',
            {
              body: { empresa_id: targetCompany },
            },
          )

          if (edgeError) throw edgeError
          if (!edgeData || !edgeData.codigo)
            throw new Error('Falha ao gerar o código da observação')

          const newCode = edgeData.codigo

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
              status: initialStatus,
              completion_date: completionDate,
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

      setObservations((prev) => {
        const mapped = {
          id: data.codigo,
          userId: data.user_id,
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
        }
        const exists = prev.some((o) => o.id === mapped.id)
        return exists ? prev : [mapped, ...prev]
      })
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

    let updateQuery = supabase.from('observacoes').update(dbUpdates)

    if (id.startsWith('OBS-')) {
      updateQuery = updateQuery.eq('codigo', id)
    } else {
      updateQuery = updateQuery.eq('id', id)
    }

    const { error } = await updateQuery

    if (error) {
      console.error('Erro ao atualizar observação:', error)
      throw error
    }

    let fetchQuery = supabase
      .from('observacoes')
      .select('*, profiles(name, whatsapp, cpf, email, empresa_id), empresas(nome)')

    if (id.startsWith('OBS-')) {
      fetchQuery = fetchQuery.eq('codigo', id)
    } else {
      fetchQuery = fetchQuery.eq('id', id)
    }

    const { data: updatedData, error: fetchError } = await fetchQuery.single()

    if (!fetchError && updatedData) {
      setObservations((prev) =>
        prev.map((obs) => {
          if (obs.id === id) {
            return {
              id: updatedData.codigo || updatedData.id,
              userId: updatedData.user_id,
              date: updatedData.date,
              observer: {
                name: updatedData.profiles?.name || obs.observer.name,
                whatsapp: updatedData.profiles?.whatsapp || obs.observer.whatsapp,
                cpf: updatedData.profiles?.cpf || obs.observer.cpf,
                email: updatedData.profiles?.email || obs.observer.email,
                companyId: updatedData.profiles?.empresa_id || obs.observer.companyId,
              },
              type: updatedData.type,
              detail: updatedData.detail || '',
              area: updatedData.area || '',
              shift: updatedData.shift || '',
              riskLevel: updatedData.risk_level || '',
              description: updatedData.description || '',
              resolutionType: updatedData.resolution_type || '',
              status: updatedData.status as any,
              assignedTo: updatedData.assigned_to,
              dueDate: updatedData.due_date || null,
              completionDate: updatedData.completion_date || null,
              managerComments: updatedData.manager_comments,
              companyName: updatedData.empresas?.nome || obs.companyName,
              justificativaCancelamento: updatedData.justificativa_cancelamento || null,
            }
          }
          return obs
        }),
      )
    } else {
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
      value={
        {
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
          refreshObservations,
        } as any
      }
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
              <Route path="/cadastro" element={<Cadastro />} />
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
