import { useState, useEffect } from 'react'
import { useMainStore } from '@/stores/main'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

export function SystemTables() {
  const { currentUser, isSuperAdmin, activeCompanyId } = useMainStore()
  const { toast } = useToast()

  const [definitions, setDefinitions] = useState<any[]>([])
  const [options, setOptions] = useState<any[]>([])
  const [customizations, setCustomizations] = useState<Record<string, string>>({})
  const [localValues, setLocalValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<string>('')

  const targetCompanyId =
    isSuperAdmin && activeCompanyId !== 'all' ? activeCompanyId : currentUser?.companyId

  useEffect(() => {
    async function fetchData() {
      if (!targetCompanyId && !isSuperAdmin) return
      setLoading(true)

      const defRes = await supabase
        .from('tabelas_sistema_definicoes')
        .select('*')
        .order('data_criacao')
      const optRes = await supabase.from('tabelas_sistema_opcoes').select('*').order('data_criacao')

      let empOptRes = { data: [] as any[] }
      if (targetCompanyId && targetCompanyId !== 'all') {
        const res = await supabase
          .from('tabelas_sistema_empresa_opcoes')
          .select('*')
          .eq('empresa_id', targetCompanyId)
        if (res.data) empOptRes.data = res.data
      }

      if (defRes.data) {
        setDefinitions(defRes.data)
        if (defRes.data.length > 0 && !activeTab) {
          setActiveTab(defRes.data[0].id)
        }
      }

      if (optRes.data) setOptions(optRes.data)

      const customMap: Record<string, string> = {}
      const localMap: Record<string, string> = {}

      empOptRes.data.forEach((co: any) => {
        customMap[co.opcao_id] = co.valor_customizado
        localMap[co.opcao_id] = co.valor_customizado
      })

      setCustomizations(customMap)
      setLocalValues(localMap)
      setLoading(false)
    }

    fetchData()
  }, [targetCompanyId, isSuperAdmin, activeTab])

  const handleSave = async (opcaoId: string, val: string | undefined) => {
    if (!targetCompanyId || targetCompanyId === 'all') {
      toast({
        variant: 'destructive',
        title: 'Atenção',
        description: 'Selecione uma empresa específica para salvar customizações.',
      })
      return
    }

    const valToSave = val?.trim()
    setIsSaving(true)

    if (!valToSave) {
      const { error } = await supabase
        .from('tabelas_sistema_empresa_opcoes')
        .delete()
        .match({ empresa_id: targetCompanyId, opcao_id: opcaoId })

      if (!error) {
        setCustomizations((prev) => {
          const next = { ...prev }
          delete next[opcaoId]
          return next
        })
        setLocalValues((prev) => ({ ...prev, [opcaoId]: '' }))
        toast({ title: 'Restaurado', description: 'O valor padrão foi restaurado.' })
      } else {
        toast({ variant: 'destructive', title: 'Erro', description: error.message })
      }
    } else {
      const { error } = await supabase.from('tabelas_sistema_empresa_opcoes').upsert(
        {
          empresa_id: targetCompanyId,
          opcao_id: opcaoId,
          valor_customizado: valToSave,
          data_atualizacao: new Date().toISOString(),
        },
        { onConflict: 'empresa_id, opcao_id' },
      )

      if (!error) {
        setCustomizations((prev) => ({ ...prev, [opcaoId]: valToSave }))
        setLocalValues((prev) => ({ ...prev, [opcaoId]: valToSave }))
        toast({
          title: 'Sucesso',
          description:
            'Valor customizado salvo com sucesso. Atualize a página para refletir no sistema.',
        })
      } else {
        toast({ variant: 'destructive', title: 'Erro', description: error.message })
      }
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

  const activeDefinition = definitions.find((d) => d.id === activeTab)
  const activeOptions = options.filter((o) => o.tabela_id === activeTab)

  const renderOption = (opt: any, def: any) => {
    const isObsType = def.chave === 'observationTypes'

    if (isObsType) {
      let parsedDefault = { value: '', label: '', desc: '' }
      try {
        parsedDefault = JSON.parse(opt.valor_padrao)
      } catch (e) {
        // fail silently
      }

      let parsedCustom = { ...parsedDefault }
      try {
        if (localValues[opt.id]) {
          parsedCustom = JSON.parse(localValues[opt.id])
        }
      } catch (e) {
        // fail silently
      }

      return (
        <Card key={opt.id} className="bg-slate-50/50">
          <CardContent className="p-4 space-y-4">
            <div className="font-medium text-sm text-slate-600 mb-2 border-b pb-2">
              Valor Base (Imutável): <span className="font-mono">{parsedDefault.value}</span>
            </div>
            <div className="grid gap-2">
              <Label>Rótulo de Exibição (Customizado)</Label>
              <Input
                value={parsedCustom.label || ''}
                onChange={(e) => {
                  const newVal = JSON.stringify({ ...parsedCustom, label: e.target.value })
                  setLocalValues((prev) => ({ ...prev, [opt.id]: newVal }))
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label>Descrição (Customizada)</Label>
              <Input
                value={parsedCustom.desc || ''}
                onChange={(e) => {
                  const newVal = JSON.stringify({ ...parsedCustom, desc: e.target.value })
                  setLocalValues((prev) => ({ ...prev, [opt.id]: newVal }))
                }}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              {customizations[opt.id] && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSave(opt.id, '')}
                  disabled={isSaving}
                >
                  Restaurar Padrão
                </Button>
              )}
              <Button
                size="sm"
                onClick={() => handleSave(opt.id, localValues[opt.id])}
                disabled={isSaving || localValues[opt.id] === customizations[opt.id]}
              >
                Salvar Customização
              </Button>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card key={opt.id} className="bg-slate-50/50">
        <CardContent className="p-4 space-y-4">
          <div className="grid gap-2">
            <Label>Valor Padrão do Sistema</Label>
            <Input value={opt.valor_padrao} disabled className="bg-slate-100 text-slate-500" />
          </div>
          <div className="grid gap-2">
            <Label>Valor Customizado</Label>
            <Input
              placeholder="Deixe em branco para usar o padrão..."
              value={localValues[opt.id] ?? ''}
              onChange={(e) => setLocalValues((prev) => ({ ...prev, [opt.id]: e.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            {customizations[opt.id] && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSave(opt.id, '')}
                disabled={isSaving}
              >
                Restaurar Padrão
              </Button>
            )}
            <Button
              size="sm"
              onClick={() => handleSave(opt.id, localValues[opt.id])}
              disabled={isSaving || localValues[opt.id] === customizations[opt.id]}
            >
              Salvar Customização
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid md:grid-cols-[250px_1fr] gap-6 items-start">
      <div className="flex flex-col space-y-1">
        {definitions.map((def) => (
          <Button
            key={def.id}
            variant={activeTab === def.id ? 'default' : 'ghost'}
            className="justify-start font-normal text-left h-auto py-2 px-3"
            onClick={() => setActiveTab(def.id)}
            disabled={isSaving}
          >
            {def.nome_tabela}
          </Button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm relative">
        {isSaving && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-lg">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-lg font-medium">{activeDefinition?.nome_tabela}</h3>
          <p className="text-sm text-slate-500 mt-1">
            {activeDefinition?.descricao || 'Gerencie as opções desta tabela.'}
          </p>
        </div>

        <div className="space-y-4">
          {activeOptions.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-sm">
              Nenhuma opção padrão encontrada.
            </div>
          ) : (
            activeOptions.map((opt) => renderOption(opt, activeDefinition))
          )}
        </div>
      </div>
    </div>
  )
}
