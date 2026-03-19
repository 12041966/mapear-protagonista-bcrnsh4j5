import { useState } from 'react'
import { useMainStore } from '@/stores/main'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trash2, Plus, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

const TABS = [
  { id: 'observationTypes', name: 'Tipos de Observação' },
  { id: 'conditions', name: 'Detalhamento: Condições' },
  { id: 'behaviors', name: 'Detalhamento: Comportamentos' },
  { id: 'areas', name: 'Áreas / Setores' },
  { id: 'risks', name: 'Risco Estimado' },
  { id: 'shifts', name: 'Turnos' },
]

export function SystemTables() {
  const { settings, updateSettings, currentUser } = useMainStore()
  const [active, setActive] = useState('areas')
  const [newItem, setNewItem] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const saveCategory = async (category: string, list: any[]) => {
    if (!currentUser?.companyId) return
    setIsSaving(true)

    // Remove old configurations for the category
    await supabase
      .from('configuracoes_sistema')
      .delete()
      .eq('empresa_id', currentUser.companyId)
      .eq('categoria', category)

    // Insert new full list
    if (list.length > 0) {
      const inserts = list.map((item) => ({
        empresa_id: currentUser.companyId,
        categoria: category,
        chave: typeof item === 'string' ? item : item.value,
        valor: typeof item === 'string' ? item : JSON.stringify(item),
      }))
      await supabase.from('configuracoes_sistema').insert(inserts)
    }

    // Sync Store
    updateSettings({ ...settings, [category]: list })
    setIsSaving(false)
  }

  const handleAdd = async () => {
    if (!newItem.trim()) return
    const list = [...(settings[active as keyof typeof settings] as string[]), newItem.trim()]
    await saveCategory(active, list)
    setNewItem('')
  }

  const handleRemove = async (idx: number) => {
    const list = [...(settings[active as keyof typeof settings] as any[])]
    list.splice(idx, 1)
    await saveCategory(active, list)
  }

  const updateObsType = async (idx: number, field: string, val: string) => {
    const list = [...settings.observationTypes]
    list[idx] = { ...list[idx], [field]: val }
    await saveCategory('observationTypes', list)
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
            disabled={isSaving}
          >
            {t.name}
          </Button>
        ))}
      </div>
      <div className="bg-white p-6 rounded-lg border shadow-sm relative">
        {isSaving && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-lg">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

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
                disabled={isSaving}
              />
              <Button onClick={handleAdd} className="shrink-0" disabled={isSaving}>
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
                    disabled={isSaving}
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
