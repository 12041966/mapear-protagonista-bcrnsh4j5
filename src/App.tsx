import { useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { StoreContext } from '@/stores/main'
import { generateMockObservations } from '@/stores/main'
import { INITIAL_SETTINGS, INITIAL_USERS } from '@/lib/constants'
import { Observation, UserProfile, AppSettings } from '@/types'

import Layout from '@/components/Layout'
import Index from '@/pages/Index'
import NovaObservacao from '@/pages/NovaObservacao'
import MinhasObservacoes from '@/pages/MinhasObservacoes'
import Gestao from '@/pages/Gestao'
import Settings from '@/pages/Settings'
import NotFound from '@/pages/NotFound'

const App = () => {
  const [observations, setObservations] = useState<Observation[]>(generateMockObservations())
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS)
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(INITIAL_USERS[0])

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

  const addUser = useCallback((user: UserProfile) => {
    setUsers((prev) => [...prev, user])
  }, [])

  const updateUser = useCallback((id: string, updates: Partial<UserProfile>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)))
  }, [])

  const removeUser = useCallback((id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }, [])

  const updateSettings = useCallback((newSettings: AppSettings) => {
    setSettings(newSettings)
  }, [])

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
      <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/nova-observacao" element={<NovaObservacao />} />
              <Route path="/minhas-observacoes" element={<MinhasObservacoes />} />
              <Route path="/gestao" element={<Gestao />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </StoreContext.Provider>
  )
}

export default App
