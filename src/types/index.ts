export type ObsStatus = 'Pendente' | 'Em Análise' | 'Concluído'

export type ResolutionType = 'Feedback fornecido' | 'Ação tomada' | 'Ação necessária'

export type Role = 'Administrador' | 'Supervisor' | 'Observador'

export interface UserProfile {
  id: string
  name: string
  email: string
  whatsapp: string
  cpf: string
  companyId: string
  registrationNumber?: string | null
  role: Role
}

export interface ObservationTypeConfig {
  value: string
  label: string
  desc: string
  color: string
}

export interface AppSettings {
  areas: string[]
  conditions: string[]
  behaviors: string[]
  shifts: string[]
  risks: string[]
  observationTypes: ObservationTypeConfig[]
  monthlyHeadcount: Record<string, number>
}

export interface Observation {
  id: string
  date: string
  observer: Omit<UserProfile, 'id' | 'role' | 'registrationNumber' | 'email'>
  type: string
  detail: string
  area: string
  shift: string
  machine?: string
  riskLevel: string
  description: string
  resolutionType: ResolutionType
  resolutionAction?: string
  status: ObsStatus
  assignedTo?: string
  deadline?: string
  dueDate?: string | null
  completionDate?: string | null
  managerComments?: string
}

export interface StoreContextType {
  observations: Observation[]
  addObservation: (obs: Omit<Observation, 'id' | 'date' | 'status'>) => void
  updateObservation: (id: string, updates: Partial<Observation>) => void
  users: UserProfile[]
  addUser: (user: UserProfile) => void
  updateUser: (id: string, user: Partial<UserProfile>) => void
  removeUser: (id: string) => void
  settings: AppSettings
  updateSettings: (settings: AppSettings) => void
  currentUser: UserProfile | null
  setCurrentUser: (user: UserProfile | null) => void
  isSuperAdmin: boolean
  activeCompanyId: string | 'all'
  setActiveCompanyId: (id: string | 'all') => void
  companies: any[]
}
