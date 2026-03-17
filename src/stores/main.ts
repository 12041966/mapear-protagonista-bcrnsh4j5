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

export const generateMockObservations = (): Observation[] => [
  {
    id: 'OBS-2026-001',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    observer: {
      name: 'João Silva',
      whatsapp: '11999999999',
      cpf: '123.456.789-00',
      companyId: 'EMP-01',
    },
    type: 'Condição de risco',
    detail: 'Pisos escorregadios',
    area: 'Produção L1',
    shift: 'T1',
    riskLevel: 'Moderado',
    description: 'Vazamento de óleo próximo à máquina de corte.',
    resolutionType: 'Ação necessária',
    status: 'Pendente',
  },
  {
    id: 'OBS-2026-002',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    observer: {
      name: 'Maria Souza',
      whatsapp: '11888888888',
      cpf: '098.765.432-11',
      companyId: 'EMP-02',
    },
    type: 'Comportamento seguro',
    detail: 'Uso correto de EPI',
    area: 'Manutenção',
    shift: 'T2',
    riskLevel: 'Leve',
    description: 'Equipe utilizando cinto de segurança corretamente em trabalho em altura.',
    resolutionType: 'Feedback fornecido',
    status: 'Concluído',
  },
  {
    id: 'OBS-2026-003',
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    observer: {
      name: 'Carlos Santos',
      whatsapp: '11777777777',
      cpf: '111.222.333-44',
      companyId: 'EMP-03',
    },
    type: 'Quase acidente',
    detail: 'Falta de sinalização',
    area: 'Logística',
    shift: 'T3',
    riskLevel: 'Grave',
    description: 'Empilhadeira quase colidiu com pedestre devido a ponto cego não sinalizado.',
    resolutionType: 'Ação necessária',
    status: 'Em Análise',
    assignedTo: 'Gerência de Segurança',
  },
]
