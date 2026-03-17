import { useState, useMemo } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { CONDITIONS, BEHAVIORS } from '@/lib/constants'

interface Props {
  data: any
  updateData: (data: any) => void
}

export function Step3Detalhamento({ data, updateData }: Props) {
  const [search, setSearch] = useState('')

  const isCondition = data.type?.includes('Condição')
  const isBehavior = data.type?.includes('Comportamento')
  const isEvent = data.type === 'Acidente' || data.type === 'Quase acidente'

  const options = useMemo(() => {
    let list: string[] = []
    if (isCondition) list = CONDITIONS
    else if (isBehavior) list = BEHAVIORS

    if (!search) return list
    return list.filter((i) => i.toLowerCase().includes(search.toLowerCase()))
  }, [isCondition, isBehavior, search])

  if (isEvent) {
    return (
      <div className="space-y-4 animate-slide-in-right">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Classificação do Evento</h3>
          <p className="text-sm text-slate-500">Descreva brevemente a natureza do evento.</p>
        </div>
        <div className="grid gap-2">
          <Label>Natureza</Label>
          <Input
            value={data.detail}
            onChange={(e) => updateData({ detail: e.target.value })}
            placeholder="Ex: Queda de material, Choque elétrico..."
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 animate-slide-in-right">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Detalhamento Específico</h3>
        <p className="text-sm text-slate-500">Selecione o tipo específico da observação.</p>
        {isBehavior && (
          <p className="text-xs text-red-500 font-medium bg-red-50 p-2 rounded border border-red-100">
            Importante: Não cite nomes de pessoas na descrição de comportamentos de risco.
          </p>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-2 max-h-[300px] overflow-y-auto pr-2">
        {options.map((opt) => (
          <div
            key={opt}
            onClick={() => updateData({ detail: opt })}
            className={`p-3 rounded-md border cursor-pointer transition-colors text-sm ${
              data.detail === opt
                ? 'bg-primary text-primary-foreground border-primary'
                : 'hover:bg-slate-50 bg-white'
            }`}
          >
            {opt}
          </div>
        ))}
        {options.length === 0 && (
          <div className="text-center py-4 text-slate-500 text-sm">
            Nenhum resultado encontrado.
          </div>
        )}
      </div>
    </div>
  )
}
