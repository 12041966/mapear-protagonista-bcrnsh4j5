import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Plus, GripVertical, Trash2 } from 'lucide-react'
import { useMainStore } from '@/stores/main'

export function GlobalSystemTables() {
  const [definitions, setDefinitions] = useState<any[]>([])
  const [options, setOptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newOptionValues, setNewOptionValues] = useState<Record<string, string>>({})
  const { toast } = useToast()
  const { refreshObservations } = useMainStore()

  const [draggedItemId, setDraggedItemId] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const [defRes, optRes] = await Promise.all([
      supabase.from('tabelas_sistema_definicoes').select('*').order('data_criacao'),
      supabase.from('tabelas_sistema_opcoes').select('*').is('empresa_id', null),
    ])

    if (defRes.data) setDefinitions(defRes.data)
    if (optRes.data) setOptions(optRes.data)
    setLoading(false)
  }

  const handleValueChange = (id: string, val: string) => {
    setOptions((prev) =>
      prev.map((o) => (o.id === id ? { ...o, valor_padrao: val, nome_opcao: val } : o)),
    )
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('tabelas_sistema_opcoes').delete().eq('id', id)
      if (error) throw error
      setOptions((prev) => prev.filter((o) => o.id !== id))
      toast({ title: 'Opção removida' })
    } catch (e: any) {
      toast({ title: 'Erro ao remover', description: e.message, variant: 'destructive' })
    }
  }

  const handleAddNewOption = async (defId: string) => {
    const val = newOptionValues[defId]
    if (!val || !val.trim()) return

    try {
      setSaving(true)
      const defOpts = getSortedOptions(defId)
      const maxOrder = defOpts.reduce((max, o) => Math.max(max, o.ordem || 0), 0)

      const { data, error } = await supabase
        .from('tabelas_sistema_opcoes')
        .insert({
          tabela_id: defId,
          nome_opcao: val.trim(),
          valor_padrao: val.trim(),
          empresa_id: null,
          ordem: maxOrder + 1,
        })
        .select()
        .single()

      if (error) throw error

      setOptions((prev) => [...prev, data])
      setNewOptionValues((prev) => ({ ...prev, [defId]: '' }))
      toast({ title: 'Opção adicionada com sucesso' })
    } catch (e: any) {
      toast({ title: 'Erro ao adicionar', description: e.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const saveChanges = async () => {
    setSaving(true)
    try {
      for (const opt of options) {
        await supabase
          .from('tabelas_sistema_opcoes')
          .update({
            valor_padrao: opt.valor_padrao,
            nome_opcao: opt.nome_opcao,
            ordem: opt.ordem || 0,
          })
          .eq('id', opt.id)
      }
      toast({ title: 'Configurações globais salvas' })
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

    setOptions((prev) => {
      const otherOptions = prev.filter((o) => o.tabela_id !== defId)
      const updatedDefOptions = newOptions.map((opt, index) => ({ ...opt, ordem: index }))
      return [...otherOptions, ...updatedDefOptions]
    })
  }

  const getSortedOptions = (defId: string) => {
    return options
      .filter((o) => o.tabela_id === defId)
      .sort((a, b) => {
        const orderA = a.ordem ?? 0
        const orderB = b.ordem ?? 0
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
              <h3 className="text-lg font-semibold">
                {def.nome_tabela}{' '}
                <span className="text-xs ml-2 bg-slate-100 text-slate-500 px-2 py-1 rounded">
                  GLOBAL
                </span>
              </h3>
              {def.descricao && <p className="text-sm text-gray-500">{def.descricao}</p>}
            </div>

            <div className="space-y-3">
              {sortedOpts.map((opt) => (
                <div
                  key={opt.id}
                  className={`flex items-center gap-4 bg-slate-50 p-3 rounded-md border transition-opacity ${draggedItemId === opt.id ? 'opacity-50' : 'opacity-100'} ${!isObsTypes ? 'cursor-grab active:cursor-grabbing' : ''}`}
                  draggable={!isObsTypes}
                  onDragStart={(e) => handleDragStart(e, opt.id)}
                  onDragOver={(e) => handleDragOver(e, opt.id, def.id)}
                  onDragEnd={() => setDraggedItemId(null)}
                >
                  {!isObsTypes && (
                    <div className="text-slate-400">
                      <GripVertical className="w-5 h-5" />
                    </div>
                  )}
                  <div className="flex-1">
                    <Label className="text-xs text-slate-500 mb-1 block">Valor padrão</Label>
                    <Input
                      value={opt.valor_padrao}
                      onChange={(e) => handleValueChange(opt.id, e.target.value)}
                    />
                  </div>
                  {!isObsTypes && (
                    <div className="mt-5">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(opt.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!isObsTypes && (
              <div className="flex items-center gap-2 pt-2 border-t mt-4">
                <Input
                  value={newOptionValues[def.id] || ''}
                  onChange={(e) =>
                    setNewOptionValues((prev) => ({ ...prev, [def.id]: e.target.value }))
                  }
                  placeholder="Adicionar novo valor global..."
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
          Salvar Configurações Globais
        </Button>
      </div>
    </div>
  )
}
