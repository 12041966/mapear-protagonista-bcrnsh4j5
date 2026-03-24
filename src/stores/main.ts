import { createContext, useContext } from 'react'
import { StoreContextType, Observation } from '@/types'

export const StoreContext = createContext<
  (StoreContextType & { refreshObservations?: () => Promise<void> }) | null
>(null)

export const useMainStore = (): StoreContextType & {
  refreshObservations?: () => Promise<void>
} => {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useMainStore must be used within a StoreProvider')
  }
  return context
}

export const generateMockObservations = (): Observation[] => {
  return []
}
