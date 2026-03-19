import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Plus, Edit2, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { GlobalSystemOptions } from './GlobalSystemOptions'
import { GlobalDefDialog } from './GlobalDefDialog'

export function GlobalSystemTables() {
  const [definitions, setDefinitions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>('')
  const [editDef, setEditDef] = useState<any | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const { toast } = useToast()

  const fetchDefs = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('tabelas_sistema_definicoes')
      .select('*')
      .order('data_criacao')
    if (data) {
      setDefinitions(data)
      if (data.length > 0 && !activeTab) setActiveTab(data[0].id)
    }
    setLoading(false)
  }, [activeTab])

  useEffect(() => {
    fetchDefs()
  }, [fetchDefs])

  const handleDelete = async (def: any) => {
    if (!window.confirm(`Deseja remover a tabela "${def.nome_tabela}" e todas as suas opções?`))
      return

    const { error } = await supabase.from('tabelas_sistema_definicoes').delete().eq('id', def.id)
    if (error) {
      toast({ variant: 'destructive', title: 'Erro', description: error.message })
    } else {
      toast({ title: 'Sucesso', description: 'Definição removida com sucesso.' })
      if (activeTab === def.id) setActiveTab('')
      fetchDefs()
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const activeDefinition = definitions.find((d) => d.id === activeTab)

  return (
    <div className="grid md:grid-cols-[250px_1fr] gap-6 items-start">
      <div className="flex flex-col space-y-1 bg-white p-4 rounded-lg border shadow-sm h-[calc(100vh-200px)] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm text-slate-800">Tabelas Globais</h3>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsAddOpen(true)}
            className="h-8 w-8 text-primary"
            title="Adicionar Definição"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {definitions.map((def) => (
          <div key={def.id} className="group relative flex items-center">
            <Button
              variant={activeTab === def.id ? 'default' : 'ghost'}
              className="w-full justify-start font-normal text-left h-auto py-2 px-3 pr-14"
              onClick={() => setActiveTab(def.id)}
            >
              <span className="truncate">{def.nome_tabela}</span>
            </Button>
            <div className="absolute right-1 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-slate-500 hover:text-primary"
                onClick={() => setEditDef(def)}
              >
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-slate-500 hover:text-destructive"
                onClick={() => handleDelete(def)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm min-h-[400px]">
        {activeDefinition ? (
          <GlobalSystemOptions definition={activeDefinition} />
        ) : (
          <div className="text-center py-12 text-slate-500">
            Selecione ou crie uma tabela do sistema.
          </div>
        )}
      </div>

      <GlobalDefDialog
        isOpen={isAddOpen || !!editDef}
        onClose={() => {
          setIsAddOpen(false)
          setEditDef(null)
        }}
        definition={editDef}
        onSaved={fetchDefs}
      />
    </div>
  )
}
