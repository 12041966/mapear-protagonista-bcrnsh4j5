import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useMainStore } from '@/stores/main'

interface Props {
  data: any
  updateData: (data: any) => void
}

export function Step4Contexto({ data, updateData }: Props) {
  const { settings } = useMainStore()

  return (
    <div className="space-y-6 animate-slide-in-right">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Contexto e Localização</h3>
        <p className="text-sm text-slate-500">Onde e quando a observação ocorreu?</p>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label>Área/Setor</Label>
          <Select value={data.area} onValueChange={(val) => updateData({ area: val })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a área" />
            </SelectTrigger>
            <SelectContent>
              {settings.areas.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label>Turno</Label>
          <div className="flex gap-3 flex-wrap">
            {settings.shifts.map((shift) => (
              <div
                key={shift}
                onClick={() => updateData({ shift })}
                className={`px-4 py-2 border rounded-md cursor-pointer transition-colors ${
                  data.shift === shift
                    ? 'bg-primary text-primary-foreground border-primary font-medium'
                    : 'hover:bg-slate-50'
                }`}
              >
                {shift}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-2">
          <Label>ID Máquina/Equipamento (Opcional)</Label>
          <Input
            value={data.machine || ''}
            onChange={(e) => updateData({ machine: e.target.value })}
            placeholder="Ex: PR-05, Empilhadeira 02"
          />
        </div>
      </div>
    </div>
  )
}
