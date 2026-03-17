import { useState } from 'react'
import { useMainStore } from '@/stores/main'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trash2, Plus } from 'lucide-react'

const TABS = [
  { id: 'observationTypes', name: 'Tipos de Observação' },
  { id: 'conditions', name: 'Detalhamento: Condições' },
  { id: 'behaviors', name: 'Detalhamento: Comportamentos' },
  { id: 'areas', name: 'Áreas / Setores' },
  { id: 'risks', name: 'Risco Estimado' },
  { id: 'shifts', name: 'Turnos' },
]

export function SystemTables() {
  const { settings, updateSettings } = useMainStore()
  const [active, setActive] = useState('areas')
  const [newItem, setNewItem] = useState('')

  const handleAdd = () => {
    if (!newItem.trim()) return
    const list = settings[active as keyof typeof settings] as string[]
    updateSettings({ ...settings, [active]: [...list, newItem.trim()] })
    setNewItem('')
  }

  const handleRemove = (idx: number) => {
    const list = [...(settings[active as keyof typeof settings] as any[])]
    list.splice(idx, 1)
    updateSettings({ ...settings, [active]: list })
  }

  const updateObsType = (idx: number, field: string, val: string) => {
    const list = [...settings.observationTypes]
    list[idx] = { ...list[idx], [field]: val }
    updateSettings({ ...settings, observationTypes: list })
  }

  return (
    <div className="grid md:grid-cols-[250px_1fr] gap-6 items-start">
      <div className="flex flex-col space-y-1">
        {TABS.map((t) => (
          <Button
            key={t.id}
            variant={active === t.id ? 'default' : 'ghost'}
            className="justify-start font-normal"
            onClick={() => setActive(t.id)}
          >
            {t.name}
          </Button>
        ))}
      </div>
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h3 className="text-lg font-medium mb-6">{TABS.find((t) => t.id === active)?.name}</h3>

        {active === 'observationTypes' ? (
          <div className="space-y-6">
            {settings.observationTypes.map((ot, i) => (
              <div key={i} className="p-4 border rounded-md space-y-4 bg-slate-50/50">
                <div className="font-medium text-sm text-slate-600 mb-2 border-b pb-2">
                  Valor Base (Imutável): <span className="font-mono">{ot.value}</span>
                </div>
                <div className="grid gap-2">
                  <Label>Rótulo de Exibição</Label>
                  <Input
                    value={ot.label}
                    onChange={(e) => updateObsType(i, 'label', e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Descrição</Label>
                  <Input
                    value={ot.desc}
                    onChange={(e) => updateObsType(i, 'desc', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2 mb-6">
              <Input
                placeholder="Adicionar novo item..."
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
              <Button onClick={handleAdd} className="shrink-0">
                <Plus className="w-4 h-4 mr-2" /> Adicionar
              </Button>
            </div>
            <div className="space-y-2">
              {(settings[active as keyof typeof settings] as string[]).map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm font-medium">{item}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(i)}
                    className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {(settings[active as keyof typeof settings] as string[]).length === 0 && (
                <div className="text-center py-6 text-slate-500 text-sm">
                  Nenhum item cadastrado.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
