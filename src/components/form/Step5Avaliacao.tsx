import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RiskLevel, ResolutionType } from '@/types'
import { RISK_COLORS } from '@/lib/constants'

interface Props {
  data: any
  updateData: (data: any) => void
}

const RISKS: RiskLevel[] = ['Leve', 'Moderado', 'Grave', 'Muito Grave']
const RESOLUTIONS: ResolutionType[] = ['Feedback fornecido', 'Ação tomada', 'Ação necessária']

export function Step5Avaliacao({ data, updateData }: Props) {
  return (
    <div className="space-y-6 animate-slide-in-right">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Avaliação e Descrição</h3>
        <p className="text-sm text-slate-500">Detalhe o que ocorreu e as ações tomadas.</p>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label>Grau de Risco Estimado</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {RISKS.map((r) => (
              <div
                key={r}
                onClick={() => updateData({ riskLevel: r })}
                className={`text-center py-2 border rounded-md cursor-pointer text-sm font-medium transition-all ${
                  data.riskLevel === r
                    ? RISK_COLORS[r] + ' border-current shadow-sm'
                    : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                {r}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-2">
          <Label>Descrição Detalhada</Label>
          <Textarea
            value={data.description}
            onChange={(e) => updateData({ description: e.target.value })}
            placeholder="Descreva o que você viu em detalhes..."
            className="min-h-[100px]"
          />
        </div>

        <div className="grid gap-2">
          <Label>Tipo de Resolução</Label>
          <Select
            value={data.resolutionType}
            onValueChange={(val) => updateData({ resolutionType: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {RESOLUTIONS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {data.resolutionType && (
          <div className="grid gap-2 animate-fade-in">
            <Label>Ação Tomada / Feedback / Ação Necessária</Label>
            <Input
              value={data.resolutionAction || ''}
              onChange={(e) => updateData({ resolutionAction: e.target.value })}
              placeholder="Especifique a ação..."
            />
          </div>
        )}
      </div>
    </div>
  )
}
