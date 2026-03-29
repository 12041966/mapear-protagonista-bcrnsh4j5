import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Plus, Eye, EyeOff, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

export function CompanySystemTables({ targetCompanyId }: { targetCompanyId?: string }) {
  const { toast } = useToast()
  const [data, setData] = useState({
    defs: [],
    opts: [],
    customMap: {},
    localMap: {},
    hiddenMap: {},
  } as any)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<string>('')

  const [newOptLabel, setNewOptLabel] = useState('')
  const [newOptDesc, setNewOptDesc] = useState('')

  useEffect(() => {
    async function fetch() {
      if (!targetCompanyId) return
      setLoading(true)
      const [defRes, optRes, empRes] = await Promise.all([
        supabase.from('tabelas_sistema_definicoes').select('*').order('data_criacao'),
        supabase
          .from('tabelas_sistema_opcoes')
          .select('*')
          .or(`empresa_id.is.null,empresa_id.eq.${targetCompanyId}`)
          .order('data_criacao'),
        supabase
          .from('tabelas_sistema_empresa_opcoes')
          .select('*')
          .eq('empresa_id', targetCompanyId),
      ])

      const cMap: any = {}
      const lMap: any = {}
      const hMap: any = {}

      optRes.data?.forEach((o) => {
        if (o.empresa_id === targetCompanyId) {
          lMap[o.id] = o.valor_padrao
        }
      })

      empRes.data?.forEach((co) => {
        if (co.valor_customizado) {
          cMap[co.opcao_id] = co.valor_customizado
          lMap[co.opcao_id] = co.valor_customizado
        }
        if (co.oculto) {
          hMap[co.opcao_id] = true
        }
      })

      setData({
        defs: defRes.data || [],
        opts: optRes.data || [],
        customMap: cMap,
        localMap: lMap,
        hiddenMap: hMap,
      })
      if (defRes.data?.length > 0 && !activeTab) setActiveTab(defRes.data[0].id)
      setLoading(false)
    }
    fetch()
  }, [targetCompanyId, activeTab])

  const handleSave = async (opt: any, val: string) => {
    if (!targetCompanyId) return
    setIsSaving(true)

    if (opt.empresa_id === targetCompanyId) {
      const activeDef = data.defs.find((d: any) => d.id === activeTab)
      let newLabel = val
      try {
        if (activeDef?.chave === 'observationTypes') {
          newLabel = JSON.parse(val).label || val
        }
      } catch (e) {
        /* ignore parse error */
      }

      const { error } = await supabase
        .from('tabelas_sistema_opcoes')
        .update({
          valor_padrao: val,
          nome_opcao: newLabel,
        })
        .eq('id', opt.id)

      if (!error) {
        setData((p: any) => ({
          ...p,
          opts: p.opts.map((o: any) =>
            o.id === opt.id ? { ...o, valor_padrao: val, nome_opcao: newLabel } : o,
          ),
          localMap: { ...p.localMap, [opt.id]: val },
        }))
        toast({ title: 'Sucesso', description: 'Opção customizada salva.' })
      } else toast({ variant: 'destructive', title: 'Erro', description: error.message })
      setIsSaving(false)
      return
    }

    const valToSave = val?.trim()
    const isHidden = data.hiddenMap[opt.id] || false

    if (!valToSave && !isHidden) {
      const { error } = await supabase
        .from('tabelas_sistema_empresa_opcoes')
        .delete()
        .match({ empresa_id: targetCompanyId, opcao_id: opt.id })
      if (!error) {
        setData((p: any) => {
          const next = { ...p }
          delete next.customMap[opt.id]
          next.localMap[opt.id] = ''
          return next
        })
        toast({ title: 'Restaurado', description: 'O valor padrão foi restaurado.' })
      } else toast({ variant: 'destructive', title: 'Erro', description: error.message })
    } else {
      const { error } = await supabase.from('tabelas_sistema_empresa_opcoes').upsert(
        {
          empresa_id: targetCompanyId,
          opcao_id: opt.id,
          valor_customizado: valToSave || '',
          oculto: isHidden,
        },
        { onConflict: 'empresa_id,opcao_id' },
      )
      if (!error) {
        setData((p: any) => ({
          ...p,
          customMap: { ...p.customMap, [opt.id]: valToSave },
          localMap: { ...p.localMap, [opt.id]: valToSave },
        }))
        toast({ title: 'Sucesso', description: 'Valor salvo com sucesso.' })
      } else toast({ variant: 'destructive', title: 'Erro', description: error.message })
    }
    setIsSaving(false)
  }

  const handleToggleHide = async (opt: any) => {
    if (!targetCompanyId) return
    setIsSaving(true)
    const isHidden = data.hiddenMap[opt.id] || false
    const newVal = !isHidden

    const customVal = data.customMap[opt.id] || ''

    if (!newVal && !customVal) {
      const { error } = await supabase
        .from('tabelas_sistema_empresa_opcoes')
        .delete()
        .match({ empresa_id: targetCompanyId, opcao_id: opt.id })
      if (!error) {
        setData((p: any) => ({ ...p, hiddenMap: { ...p.hiddenMap, [opt.id]: false } }))
      }
    } else {
      const { error } = await supabase.from('tabelas_sistema_empresa_opcoes').upsert(
        {
          empresa_id: targetCompanyId,
          opcao_id: opt.id,
          valor_customizado: customVal,
          oculto: newVal,
        },
        { onConflict: 'empresa_id,opcao_id' },
      )
      if (!error) {
        setData((p: any) => ({ ...p, hiddenMap: { ...p.hiddenMap, [opt.id]: newVal } }))
      }
    }
    setIsSaving(false)
  }

  const handleDeleteCustom = async (optId: string) => {
    if (!targetCompanyId) return
    setIsSaving(true)
    const { error } = await supabase.from('tabelas_sistema_opcoes').delete().eq('id', optId)
    if (!error) {
      setData((p: any) => ({
        ...p,
        opts: p.opts.filter((o: any) => o.id !== optId),
      }))
      toast({ title: 'Removido', description: 'Opção customizada removida.' })
    } else toast({ variant: 'destructive', title: 'Erro', description: error.message })
    setIsSaving(false)
  }

  const handleCreateOption = async () => {
    if (!targetCompanyId || !newOptLabel.trim()) return
    setIsSaving(true)

    const activeDef = data.defs.find((d: any) => d.id === activeTab)
    const isObs = activeDef?.chave === 'observationTypes'
    let valor_padrao = newOptLabel.trim()

    if (isObs) {
      valor_padrao = JSON.stringify({
        value: newOptLabel.trim(),
        label: newOptLabel.trim(),
        desc: newOptDesc.trim(),
      })
    }

    const { data: newOpt, error } = await supabase
      .from('tabelas_sistema_opcoes')
      .insert({
        tabela_id: activeTab,
        nome_opcao: newOptLabel.trim(),
        valor_padrao: valor_padrao,
        empresa_id: targetCompanyId,
      })
      .select()
      .single()

    if (!error && newOpt) {
      setData((p: any) => ({
        ...p,
        opts: [...p.opts, newOpt],
        localMap: { ...p.localMap, [newOpt.id]: newOpt.valor_padrao },
      }))
      setNewOptLabel('')
      setNewOptDesc('')
      toast({ title: 'Sucesso', description: 'Nova opção adicionada.' })
    } else {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error?.message || 'Falha ao adicionar opção',
      })
    }
    setIsSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const activeDef = data.defs.find((d: any) => d.id === activeTab)
  const activeOpts = data.opts.filter((o: any) => o.tabela_id === activeTab)
  const isObsDef = activeDef?.chave === 'observationTypes'

  return (
    <div className="grid md:grid-cols-[250px_1fr] gap-6 items-start">
      <div className="flex flex-col space-y-1">
        {data.defs.map((def: any) => (
          <Button
            key={def.id}
            variant={activeTab === def.id ? 'default' : 'ghost'}
            className="justify-start font-normal h-auto py-2 px-3 text-left"
            onClick={() => setActiveTab(def.id)}
          >
            {def.nome_tabela}
          </Button>
        ))}
      </div>
      <div className="bg-white p-6 rounded-lg border shadow-sm relative">
        {isSaving && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}
        <div className="mb-6">
          <h3 className="text-lg font-medium">{activeDef?.nome_tabela}</h3>
          <p className="text-sm text-slate-500 mt-1">
            {activeDef?.descricao || 'Gerencie as opções desta tabela.'}
          </p>
        </div>

        <Card className="bg-slate-50 border-dashed mb-6 shadow-none">
          <CardContent className="p-4 space-y-4">
            <div className="font-medium text-sm text-slate-700">Adicionar Nova Opção</div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label>Nome / Rótulo</Label>
                <Input
                  placeholder="Ex: Novo Setor"
                  value={newOptLabel}
                  onChange={(e) => setNewOptLabel(e.target.value)}
                />
              </div>
              {isObsDef && (
                <div className="grid gap-2">
                  <Label>Descrição</Label>
                  <Input
                    placeholder="Descreva a finalidade desta opção"
                    value={newOptDesc}
                    onChange={(e) => setNewOptDesc(e.target.value)}
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end pt-2">
              <Button
                size="sm"
                onClick={handleCreateOption}
                disabled={!newOptLabel.trim() || isSaving}
              >
                <Plus className="w-4 h-4 mr-2" /> Adicionar
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {activeOpts.map((opt: any) => {
            const isCustom = opt.empresa_id === targetCompanyId
            const isHidden = data.hiddenMap[opt.id] || false

            let pDef = { value: opt.valor_padrao, label: '', desc: '' }
            let pCus = { ...pDef }
            if (isObsDef) {
              try {
                pDef = JSON.parse(opt.valor_padrao)
                pCus = data.localMap[opt.id] ? JSON.parse(data.localMap[opt.id]) : pDef
              } catch (e) {}
            }
            const customVal = data.localMap[opt.id] ?? ''

            const isModified = isCustom
              ? data.localMap[opt.id] !== opt.valor_padrao
              : data.localMap[opt.id] !== (data.customMap[opt.id] || '')

            return (
              <Card
                key={opt.id}
                className={cn(
                  'transition-opacity',
                  isHidden ? 'opacity-60 bg-slate-100' : 'bg-white',
                )}
              >
                <CardContent className="p-4 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {isCustom ? 'Opção Customizada' : 'Opção do Sistema'}
                      {isHidden && ' (Oculto)'}
                    </Label>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleToggleHide(opt)}
                        title={isHidden ? 'Exibir' : 'Ocultar'}
                      >
                        {isHidden ? (
                          <EyeOff className="h-4 w-4 text-slate-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-slate-600" />
                        )}
                      </Button>
                      {isCustom && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteCustom(opt.id)}
                          title="Excluir Opção"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {isObsDef ? (
                    <>
                      {!isCustom && (
                        <div className="text-xs text-slate-500 mb-2 font-mono">
                          Padrão: {pDef.value}
                        </div>
                      )}
                      <div className="grid gap-2">
                        <Label>Rótulo</Label>
                        <Input
                          value={pCus.label || ''}
                          onChange={(e) =>
                            setData((p: any) => ({
                              ...p,
                              localMap: {
                                ...p.localMap,
                                [opt.id]: JSON.stringify({ ...pCus, label: e.target.value }),
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Descrição</Label>
                        <Input
                          value={pCus.desc || ''}
                          onChange={(e) =>
                            setData((p: any) => ({
                              ...p,
                              localMap: {
                                ...p.localMap,
                                [opt.id]: JSON.stringify({ ...pCus, desc: e.target.value }),
                              },
                            }))
                          }
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {!isCustom && (
                        <div className="grid gap-2">
                          <Label>Valor Padrão</Label>
                          <Input
                            value={opt.valor_padrao}
                            disabled
                            className="bg-slate-50 text-slate-500"
                          />
                        </div>
                      )}
                      <div className="grid gap-2">
                        <Label>{isCustom ? 'Valor' : 'Valor Customizado'}</Label>
                        <Input
                          value={customVal}
                          onChange={(e) =>
                            setData((p: any) => ({
                              ...p,
                              localMap: { ...p.localMap, [opt.id]: e.target.value },
                            }))
                          }
                        />
                      </div>
                    </>
                  )}
                  <div className="flex justify-end gap-2 pt-2">
                    {!isCustom && data.customMap[opt.id] && (
                      <Button variant="outline" size="sm" onClick={() => handleSave(opt, '')}>
                        Restaurar Padrão
                      </Button>
                    )}
                    <Button
                      size="sm"
                      onClick={() => handleSave(opt, data.localMap[opt.id] || '')}
                      disabled={!isModified}
                    >
                      Salvar Alterações
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
          {activeOpts.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-sm">
              Nenhuma opção encontrada para esta tabela.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
