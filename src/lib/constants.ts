import { AppSettings, UserProfile } from '@/types'

export const TYPE_COLORS: Record<string, string> = {
  'Condição de risco': 'text-orange-600 bg-orange-100',
  'Condição segura': 'text-emerald-600 bg-emerald-100',
  'Comportamento de risco': 'text-red-600 bg-red-100',
  'Comportamento seguro': 'text-blue-600 bg-blue-100',
  Acidente: 'text-red-800 bg-red-200',
  'Quase acidente': 'text-amber-700 bg-amber-200',
}

export const RISK_COLORS: Record<string, string> = {
  Leve: 'text-emerald-600 bg-emerald-100',
  Moderado: 'text-amber-600 bg-amber-100',
  Grave: 'text-orange-600 bg-orange-100',
  'Muito Grave': 'text-red-600 bg-red-100',
}

export const CHART_COLORS: Record<string, string> = {
  'Condição de risco': '#f59e0b',
  'Condição segura': '#10b981',
  'Comportamento de risco': '#ef4444',
  'Comportamento seguro': '#3b82f6',
  Acidente: '#991b1b',
  'Quase acidente': '#b45309',
}

export const INITIAL_SETTINGS: AppSettings = {
  areas: [
    'Produção L1',
    'Produção L2',
    'Manutenção',
    'Logística',
    'Almoxarifado',
    'Administrativo',
    'Pátio Externo',
  ],
  shifts: ['T1', 'T2', 'T3', 'Adm'],
  risks: ['Leve', 'Moderado', 'Grave', 'Muito Grave'],
  conditions: [
    'Mãos na linha de fogo',
    'Pisos escorregadios',
    'Iluminação inadequada',
    'Falta de sinalização',
    'Ferramentas defeituosas',
    'Vazamento de produtos',
    'Fiação exposta',
    'Equipamento sem proteção',
    'Bloqueio de emergência',
    'Trabalho em altura sem EPI',
  ],
  behaviors: [
    'Uso inseguro de equipamentos',
    'Brincadeira rude',
    'Não uso de EPI',
    'Postura inadequada',
    'Uso de celular na operação',
    'Atalho em procedimento',
    'Velocidade excessiva',
    'Falta de atenção',
  ],
  observationTypes: [
    {
      value: 'Condição de risco',
      label: 'Condição de risco (a corrigir)',
      desc: 'Algo a corrigir no ambiente',
      color: 'text-orange-500',
    },
    {
      value: 'Condição segura',
      label: 'Condição segura (a melhorar)',
      desc: 'Boas práticas observadas',
      color: 'text-emerald-500',
    },
    {
      value: 'Comportamento de risco',
      label: 'Comportamento de risco (alerta)',
      desc: 'Ação insegura de alguém',
      color: 'text-red-500',
    },
    {
      value: 'Comportamento seguro',
      label: 'Comportamento seguro (reforço)',
      desc: 'Ação correta e segura',
      color: 'text-blue-500',
    },
  ],
  monthlyHeadcount: {
    '2026-02': 110,
    '2026-03': 120,
  },
}

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'USR-01',
    name: 'João Silva',
    whatsapp: '11999999999',
    cpf: '123.456.789-00',
    companyId: 'EMP-01',
    role: 'Administrador',
  },
  {
    id: 'USR-02',
    name: 'Maria Souza',
    whatsapp: '11888888888',
    cpf: '098.765.432-11',
    companyId: 'EMP-02',
    role: 'Supervisor',
  },
  {
    id: 'USR-03',
    name: 'Carlos Santos',
    whatsapp: '11777777777',
    cpf: '111.222.333-44',
    companyId: 'EMP-03',
    role: 'Observador',
  },
  {
    id: 'USR-04',
    name: 'Ana Lima',
    whatsapp: '11666666666',
    cpf: '222.333.444-55',
    companyId: 'EMP-01',
    role: 'Observador',
  },
  {
    id: 'USR-05',
    name: 'Pedro Costa',
    whatsapp: '11555555555',
    cpf: '333.444.555-66',
    companyId: 'EMP-02',
    role: 'Observador',
  },
  {
    id: 'USR-06',
    name: 'Luiza Mendes',
    whatsapp: '11444444444',
    cpf: '444.555.666-77',
    companyId: 'EMP-03',
    role: 'Supervisor',
  },
]
