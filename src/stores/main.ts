import { createContext, useContext } from 'react'
import { StoreContextType, Observation } from '@/types'

export const StoreContext = createContext<StoreContextType | null>(null)

export const useMainStore = (): StoreContextType => {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useMainStore must be used within a StoreProvider')
  }
  return context
}

// Removed hardcoded mock data per requirements to ensure real data from Supabase is used.
export const generateMockObservations = (): Observation[] => {
  return []
}
