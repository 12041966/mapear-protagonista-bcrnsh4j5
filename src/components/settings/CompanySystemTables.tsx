import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Plus, GripVertical } from 'lucide-react'
import { useMainStore } from '@/stores/main'

export function CompanySystemTables({ targetCompanyId }: { targetCompanyId: string | undefined }) {
  const [definitions, setDefinitions] = useState<any[]>([])
  const [options, setOptions] = useState<any[]>([])
  const [customOptions, setCustomOptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newOptionValues, setNewOptionValues] = useState<Record<string, string>>({})
  const { refreshObservations } = useMainStore()
  const { toast } = useToast()

  const [draggedItemId, setDraggedItemId] = useState<string | null>(null)

  useEffect(() => {
    if (!targetCompanyId) return
    fetchData()
  }, [targetCompanyId])

  const fetchData = async () => {
    setLoading(true)
    const [defRes, optRes, customRes] = await Promise.all([
      supabase.from('tabelas_sistema_definicoes').select('*').order('data_criacao'),
      supabase
        .from('tabelas_sistema_opcoes')
        .select('*')
        .or(`empresa_id.is.null,empresa_id.eq.${targetCompanyId}`),
      supabase.from('tabelas_sistema_empresa_opcoes').select('*').eq('empresa_id', targetCompanyId),
    ])

    if (defRes.data) setDefinitions(defRes.data)
    if (optRes.data) setOptions(optRes.data)
    if (customRes.data) setCustomOptions(customRes.data)
    setLoading(false)
  }

  const handleCustomValueChange = (opcaoId: string, value: string) => {
    setCustomOptions((prev) => {
      const existing = prev.find((p) => p.opcao_id === opcaoId)
      if (existing) {
        return prev.map((p) => (p.opcao_id === opcaoId ? { ...p, valor_customizado: value } : p))
      }
      return [...prev, { opcao_id: opcaoId, valor_customizado: value, oculto: false, ordem: 0 }]
    })
  }

  const handleHiddenChange = (opcaoId: string, hidden: boolean) => {
    setCustomOptions((prev) => {
      const existing = prev.find((p) => p.opcao_id === opcaoId)
      if (existing) {
        return prev.map((p) => (p.opcao_id === opcaoId ? { ...p, oculto: hidden } : p))
      }
      return [...prev, { opcao_id: opcaoId, valor_customizado: '', oculto: hidden, ordem: 0 }]
    })
  }

  const handleAddNewOption = async (defId: string) => {
    const val = newOptionValues[defId]
    if (!val || !val.trim()) return

    try {
      setSaving(true)
      const maxOrder = options
        .filter((o) => o.tabela_id === defId)
        .reduce((max, o) => {
          const cOpt = customOptions.find((c) => c.opcao_id === o.id)
          const order = cOpt?.ordem ?? o.ordem ?? 0
          return Math.max(max, order)
        }, 0)

      const { data, error } = await supabase
        .from('tabelas_sistema_opcoes')
        .insert({
          tabela_id: defId,
          nome_opcao: val.trim(),
          valor_padrao: val.trim(),
          empresa_id: targetCompanyId,
          ordem: maxOrder + 1,
        })
        .select()
        .single()

      if (error) throw error

      setOptions((prev) => [...prev, data])
      setNewOptionValues((prev) => ({ ...prev, [defId]: '' }))
      toast({ title: 'Opção adicionada com sucesso' })
    } catch (e: any) {
      toast({ title: 'Erro ao adicionar opção', description: e.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const saveChanges = async () => {
    if (!targetCompanyId) return
    setSaving(true)
    try {
      const updates = customOptions.map((c) => ({
        empresa_id: targetCompanyId,
        opcao_id: c.opcao_id,
        valor_customizado: c.valor_customizado || '',
        oculto: c.oculto || false,
        ordem: c.ordem || 0,
      }))

      for (const update of updates) {
        const existing = await supabase
          .from('tabelas_sistema_empresa_opcoes')
          .select('id')
          .eq('empresa_id', targetCompanyId)
          .eq('opcao_id', update.opcao_id)
          .maybeSingle()

        if (existing.data) {
          await supabase
            .from('tabelas_sistema_empresa_opcoes')
            .update(update)
            .eq('id', existing.data.id)
        } else {
          await supabase.from('tabelas_sistema_empresa_opcoes').insert(update)
        }
      }

      toast({ title: 'Configurações salvas com sucesso' })
      refreshObservations()
    } catch (e: any) {
      toast({ title: 'Erro ao salvar', description: e.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItemId(id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, id: string, defId: string) => {
    e.preventDefault()
    if (!draggedItemId || draggedItemId === id) return

    const defOptions = getSortedOptions(defId)
    const draggedIndex = defOptions.findIndex((o) => o.id === draggedItemId)
    const dropIndex = defOptions.findIndex((o) => o.id === id)

    if (draggedIndex < 0 || dropIndex < 0) return

    const newOptions = [...defOptions]
    const [draggedItem] = newOptions.splice(draggedIndex, 1)
    newOptions.splice(dropIndex, 0, draggedItem)

    const updatedCustoms = [...customOptions]
    newOptions.forEach((opt, index) => {
      const cIndex = updatedCustoms.findIndex((c) => c.opcao_id === opt.id)
      if (cIndex >= 0) {
        updatedCustoms[cIndex] = { ...updatedCustoms[cIndex], ordem: index }
      } else {
        updatedCustoms.push({
          opcao_id: opt.id,
          valor_customizado: '',
          oculto: false,
          ordem: index,
        })
      }
    })
    setCustomOptions(updatedCustoms)
  }

  const getSortedOptions = (defId: string) => {
    return options
      .filter((o) => o.tabela_id === defId)
      .sort((a, b) => {
        const cA = customOptions.find((c) => c.opcao_id === a.id)
        const cB = customOptions.find((c) => c.opcao_id === b.id)
        const orderA = cA?.ordem ?? a.ordem ?? 0
        const orderB = cB?.ordem ?? b.ordem ?? 0
        if (orderA === orderB) {
          return new Date(a.data_criacao).getTime() - new Date(b.data_criacao).getTime()
        }
        return orderA - orderB
      })
  }

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-10">
      {definitions.map((def) => {
        const sortedOpts = getSortedOptions(def.id)
        const isObsTypes = def.chave === 'observationTypes'

        return (
          <div key={def.id} className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{def.nome_tabela}</h3>
              {def.descricao && <p className="text-sm text-gray-500">{def.descricao}</p>}
            </div>

            <div className="space-y-3">
              {sortedOpts.map((opt) => {
                const custom = customOptions.find((c) => c.opcao_id === opt.id)
                const value = custom?.valor_customizado || opt.valor_padrao
                const hidden = custom?.oculto || false

                let parsedName = opt.valor_padrao
                let parsedDesc = ''
                if (isObsTypes) {
                  try {
                    const parsed = JSON.parse(opt.valor_padrao)
                    parsedName = parsed.name || parsed.label || opt.valor_padrao
                    parsedDesc = parsed.description || ''
                  } catch (e) {
                    // Fallback se não for JSON
                  }
                }

                return (
                  <div
                    key={opt.id}
                    className={`flex items-center gap-4 bg-slate-50 p-3 rounded-md border transition-opacity cursor-grab active:cursor-grabbing ${draggedItemId === opt.id ? 'opacity-50' : 'opacity-100'}`}
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, opt.id)}
                    onDragOver={(e) => handleDragOver(e, opt.id, def.id)}
                    onDragEnd={() => setDraggedItemId(null)}
                  >
                    <div className="text-slate-400">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      {isObsTypes ? (
                        <div className="flex flex-col justify-center">
                          <span className="text-sm font-semibold text-slate-900">{parsedName}</span>
                          {parsedDesc && (
                            <span className="text-xs text-slate-500 mt-0.5">{parsedDesc}</span>
                          )}
                        </div>
                      ) : (
                        <>
                          <Label className="text-xs text-slate-500 mb-1 block">
                            Valor original: {opt.valor_padrao}
                          </Label>
                          <Input
                            value={value}
                            onChange={(e) => handleCustomValueChange(opt.id, e.target.value)}
                            placeholder="Novo nome (opcional)"
                          />
                        </>
                      )}
                    </div>
                    <div className={`flex items-center gap-2 ${!isObsTypes ? 'mt-5' : ''}`}>
                      <Switch
                        checked={!hidden}
                        onCheckedChange={(checked) => handleHiddenChange(opt.id, !checked)}
                      />
                      <Label className="text-sm">{hidden ? 'Oculto' : 'Visível'}</Label>
                    </div>
                  </div>
                )
              })}
            </div>

            {!isObsTypes && (
              <div className="flex items-center gap-2 pt-2 border-t mt-4">
                <Input
                  value={newOptionValues[def.id] || ''}
                  onChange={(e) =>
                    setNewOptionValues((prev) => ({ ...prev, [def.id]: e.target.value }))
                  }
                  placeholder="Adicionar novo valor..."
                  className="max-w-md"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddNewOption(def.id)}
                  disabled={saving}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            )}
          </div>
        )
      })}

      <div className="flex justify-end sticky bottom-0 bg-white/80 backdrop-blur-sm p-4 border-t z-10">
        <Button onClick={saveChanges} disabled={saving}>
          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Salvar Configurações
        </Button>
      </div>
    </div>
  )
}
