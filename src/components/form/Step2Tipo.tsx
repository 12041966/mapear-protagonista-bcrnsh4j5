import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { AlertTriangle, CheckCircle, Flame, ShieldCheck, Activity } from 'lucide-react'
import { useMainStore } from '@/stores/main'

interface Props {
  data: any
  updateData: (data: any) => void
}

export function Step2Tipo({ data, updateData }: Props) {
  const { settings } = useMainStore()

  const getIcon = (val: string) => {
    const v = val.toLowerCase()
    if (v.includes('condição de risco')) return AlertTriangle
    if (v.includes('condição segura')) return CheckCircle
    if (v.includes('comportamento de risco')) return Flame
    if (v.includes('comportamento seguro')) return ShieldCheck
    return Activity
  }

  return (
    <div className="space-y-4 animate-slide-in-right">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Tipo de Observação</h3>
        <p className="text-sm text-slate-500">Selecione a categoria principal do seu relato.</p>
      </div>

      <RadioGroup
        value={data.type}
        onValueChange={(val) => updateData({ type: val, detail: '' })}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {settings.observationTypes.map((t) => {
          const Icon = getIcon(t.value)
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
