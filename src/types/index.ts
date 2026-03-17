export type RiskLevel = 'Leve' | 'Moderado' | 'Grave' | 'Muito Grave'

export type ObsType =
  | 'Condição de risco'
  | 'Condição segura'
  | 'Comportamento de risco'
  | 'Comportamento seguro'
  | 'Acidente'
  | 'Quase acidente'

export type ObsStatus = 'Pendente' | 'Em Análise' | 'Concluído'

export type ResolutionType = 'Feedback fornecido' | 'Ação tomada' | 'Ação necessária'

export interface Observation {
  id: string
  date: string
  observer: {
    name: string
    whatsapp: string
    cpf: string
    companyId: string
  }
  type: ObsType
  detail: string
  area: string
  shift: string
  machine?: string
  riskLevel: RiskLevel
  description: string
  resolutionType: ResolutionType
  resolutionAction?: string
  status: ObsStatus
  assignedTo?: string
  deadline?: string
  managerComments?: string
}

export interface StoreContextType {
  observations: Observation[]
  addObservation: (obs: Omit<Observation, 'id' | 'date' | 'status'>) => void
  updateObservation: (id: string, updates: Partial<Observation>) => void
}
