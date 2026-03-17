import { useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { StoreContext } from '@/stores/main'
import { generateMockObservations } from '@/stores/main'
import { Observation } from '@/types'

import Layout from '@/components/Layout'
import Index from '@/pages/Index'
import NovaObservacao from '@/pages/NovaObservacao'
import Gestao from '@/pages/Gestao'
import NotFound from '@/pages/NotFound'

const App = () => {
  const [observations, setObservations] = useState<Observation[]>(generateMockObservations())

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

  return (
    <StoreContext.Provider value={{ observations, addObservation, updateObservation }}>
      <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/nova-observacao" element={<NovaObservacao />} />
              <Route path="/gestao" element={<Gestao />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </StoreContext.Provider>
  )
}

export default App
