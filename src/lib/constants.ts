import { ObsType, RiskLevel } from '@/types'

export const CONDITIONS = [
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
]

export const BEHAVIORS = [
  'Uso inseguro de equipamentos',
  'Brincadeira rude',
  'Não uso de EPI',
  'Postura inadequada',
  'Uso de celular na operação',
  'Atalho em procedimento',
  'Velocidade excessiva',
  'Falta de atenção',
]

export const AREAS = [
  'Produção L1',
  'Produção L2',
  'Manutenção',
  'Logística',
  'Almoxarifado',
  'Administrativo',
  'Pátio Externo',
]

export const SHIFTS = ['T1', 'T2', 'T3', 'Adm']

export const TYPE_COLORS: Record<ObsType, string> = {
  'Condição de risco': 'text-orange-600 bg-orange-100',
  'Condição segura': 'text-emerald-600 bg-emerald-100',
  'Comportamento de risco': 'text-red-600 bg-red-100',
  'Comportamento seguro': 'text-emerald-600 bg-emerald-100',
  Acidente: 'text-red-700 bg-red-200',
  'Quase acidente': 'text-amber-600 bg-amber-100',
}

export const RISK_COLORS: Record<RiskLevel, string> = {
  Leve: 'text-emerald-600 bg-emerald-100',
  Moderado: 'text-amber-600 bg-amber-100',
  Grave: 'text-orange-600 bg-orange-100',
  'Muito Grave': 'text-red-600 bg-red-100',
}
