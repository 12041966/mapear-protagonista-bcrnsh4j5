import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card } from '@/components/ui/card'
import { AlertTriangle, CheckCircle, Flame, ShieldCheck, Activity, XOctagon } from 'lucide-react'
import { ObsType } from '@/types'

const TYPES: { value: ObsType; label: string; desc: string; icon: any; color: string }[] = [
  {
    value: 'Condição de risco',
    label: 'Condição de Risco',
    desc: 'Algo a corrigir no ambiente',
    icon: AlertTriangle,
    color: 'text-orange-500',
  },
  {
    value: 'Condição segura',
    label: 'Condição Segura',
    desc: 'Boas práticas observadas',
    icon: CheckCircle,
    color: 'text-emerald-500',
  },
  {
    value: 'Comportamento de risco',
    label: 'Comport. de Risco',
    desc: 'Ação insegura de alguém',
    icon: Flame,
    color: 'text-red-500',
  },
  {
    value: 'Comportamento seguro',
    label: 'Comport. Seguro',
    desc: 'Ação correta e segura',
    icon: ShieldCheck,
    color: 'text-emerald-600',
  },
  {
    value: 'Acidente',
    label: 'Acidente',
    desc: 'Houve lesão ou dano',
    icon: XOctagon,
    color: 'text-red-700',
  },
  {
    value: 'Quase acidente',
    label: 'Quase Acidente',
    desc: 'Quase ocorreu um dano',
    icon: Activity,
    color: 'text-amber-500',
  },
]

interface Props {
  data: any
  updateData: (data: any) => void
}

export function Step2Tipo({ data, updateData }: Props) {
  return (
    <div className="space-y-4 animate-slide-in-right">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Tipo de Observação</h3>
        <p className="text-sm text-slate-500">Selecione a categoria principal do seu relato.</p>
      </div>

      <RadioGroup
        value={data.type}
        onValueChange={(val) => updateData({ type: val as ObsType, detail: '' })}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {TYPES.map((t) => {
          const Icon = t.icon
          const isActive = data.type === t.value
          return (
            <div key={t.value}>
              <RadioGroupItem value={t.value} id={t.value} className="peer sr-only" />
              <Label
                htmlFor={t.value}
                className={`flex items-start gap-4 rounded-lg border-2 p-4 cursor-pointer transition-all hover:bg-slate-50 ${
                  isActive ? 'border-primary bg-primary/5' : 'border-muted'
                }`}
              >
                <Icon className={`w-6 h-6 mt-0.5 ${t.color}`} />
                <div className="space-y-1">
                  <p className="font-semibold text-slate-900">{t.label}</p>
                  <p className="text-xs text-slate-500 font-normal">{t.desc}</p>
                </div>
              </Label>
            </div>
          )
        })}
      </RadioGroup>
    </div>
  )
}
