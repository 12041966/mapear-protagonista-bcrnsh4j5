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

export const generateMockObservations = (): Observation[] => {
  const now = new Date()
  const createDate = (daysAgo: number) => {
    const d = new Date(now)
    d.setDate(d.getDate() - daysAgo)
    return d.toISOString()
  }

  return [
    {
      id: 'OBS-2026-001',
      date: createDate(2),
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
      date: createDate(12),
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
      date: createDate(25),
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
    {
      id: 'OBS-2026-004',
      date: createDate(45),
      observer: {
        name: 'Ana Lima',
        whatsapp: '11666666666',
        cpf: '222.333.444-55',
        companyId: 'EMP-01',
      },
      type: 'Condição segura',
      detail: 'Área limpa',
      area: 'Produção L2',
      shift: 'T1',
      riskLevel: 'Leve',
      description: 'Setor organizado e limpo conforme padrão 5S.',
      resolutionType: 'Feedback fornecido',
      status: 'Concluído',
    },
    {
      id: 'OBS-2026-005',
      date: createDate(60),
      observer: {
        name: 'Pedro Costa',
        whatsapp: '11555555555',
        cpf: '333.444.555-66',
        companyId: 'EMP-02',
      },
      type: 'Comportamento de risco',
      detail: 'Não uso de EPI',
      area: 'Manutenção',
      shift: 'T2',
      riskLevel: 'Moderado',
      description: 'Colaborador operando lixadeira sem óculos de proteção.',
      resolutionType: 'Ação tomada',
      status: 'Concluído',
    },
    {
      id: 'OBS-2026-006',
      date: createDate(75),
      observer: {
        name: 'Luiza Mendes',
        whatsapp: '11444444444',
        cpf: '444.555.666-77',
        companyId: 'EMP-03',
      },
      type: 'Acidente',
      detail: 'Corte superficial',
      area: 'Produção L1',
      shift: 'T3',
      riskLevel: 'Grave',
      description: 'Corte na mão ao manusear chapa metálica sem luva adequada.',
      resolutionType: 'Ação necessária',
      status: 'Pendente',
    },
  ]
}
