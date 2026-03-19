import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

export function CompanySystemTables({ targetCompanyId }: { targetCompanyId?: string }) {
  const { toast } = useToast()
  const [data, setData] = useState({ defs: [], opts: [], customMap: {}, localMap: {} } as any)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<string>('')

  useEffect(() => {
    async function fetch() {
      if (!targetCompanyId) return
      setLoading(true)
      const [defRes, optRes, empRes] = await Promise.all([
        supabase.from('tabelas_sistema_definicoes').select('*').order('data_criacao'),
        supabase.from('tabelas_sistema_opcoes').select('*').order('data_criacao'),
        supabase
          .from('tabelas_sistema_empresa_opcoes')
          .select('*')
          .eq('empresa_id', targetCompanyId),
      ])

      const cMap: any = {}
      const lMap: any = {}
      empRes.data?.forEach((co) => {
        cMap[co.opcao_id] = co.valor_customizado
        lMap[co.opcao_id] = co.valor_customizado
      })

      setData({ defs: defRes.data || [], opts: optRes.data || [], customMap: cMap, localMap: lMap })
      if (defRes.data?.length > 0 && !activeTab) setActiveTab(defRes.data[0].id)
      setLoading(false)
    }
    fetch()
  }, [targetCompanyId, activeTab])

  const handleSave = async (opcaoId: string, val: string) => {
    if (!targetCompanyId) return
    const valToSave = val?.trim()
    setIsSaving(true)
    if (!valToSave) {
      const { error } = await supabase
        .from('tabelas_sistema_empresa_opcoes')
        .delete()
        .match({ empresa_id: targetCompanyId, opcao_id: opcaoId })
      if (!error) {
        setData((p: any) => {
          const next = { ...p }
          delete next.customMap[opcaoId]
          next.localMap[opcaoId] = ''
          return next
        })
        toast({ title: 'Restaurado', description: 'O valor padrão foi restaurado.' })
      } else toast({ variant: 'destructive', title: 'Erro', description: error.message })
    } else {
      const { error } = await supabase.from('tabelas_sistema_empresa_opcoes').upsert({
        empresa_id: targetCompanyId,
        opcao_id: opcaoId,
        valor_customizado: valToSave,
      })
      if (!error) {
        setData((p: any) => ({
          ...p,
          customMap: { ...p.customMap, [opcaoId]: valToSave },
          localMap: { ...p.localMap, [opcaoId]: valToSave },
        }))
        toast({ title: 'Sucesso', description: 'Valor salvo com sucesso.' })
      } else toast({ variant: 'destructive', title: 'Erro', description: error.message })
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
        <div className="space-y-4">
          {activeOpts.map((opt: any) => {
            const isObs = activeDef?.chave === 'observationTypes'
            let pDef = { value: opt.valor_padrao, label: '', desc: '' }
            let pCus = { ...pDef }
            if (isObs) {
              try {
                pDef = JSON.parse(opt.valor_padrao)
                pCus = data.localMap[opt.id] ? JSON.parse(data.localMap[opt.id]) : pDef
              } catch (e) {
                // ignore parse error
              }
            }
            const customVal = data.localMap[opt.id] ?? ''
            return (
              <Card key={opt.id} className="bg-slate-50/50">
                <CardContent className="p-4 space-y-4">
                  {isObs ? (
                    <>
                      <div className="text-sm text-slate-600 mb-2 border-b pb-2">
                        Base: <span className="font-mono">{pDef.value}</span>
                      </div>
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
                      <div className="grid gap-2">
                        <Label>Valor Padrão do Sistema</Label>
                        <Input value={opt.valor_padrao} disabled className="bg-slate-100" />
                      </div>
                      <div className="grid gap-2">
                        <Label>Valor Customizado</Label>
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
                    {data.customMap[opt.id] && (
                      <Button variant="outline" size="sm" onClick={() => handleSave(opt.id, '')}>
                        Restaurar Padrão
                      </Button>
                    )}
                    <Button
                      size="sm"
                      onClick={() => handleSave(opt.id, data.localMap[opt.id] || '')}
                      disabled={data.localMap[opt.id] === data.customMap[opt.id]}
                    >
                      Salvar Customização
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
