import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

export function GlobalDefDialog({ isOpen, onClose, definition, onSaved }: any) {
  const [nome, setNome] = useState('')
  const [chave, setChave] = useState('')
  const [desc, setDesc] = useState('')
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (definition) {
      setNome(definition.nome_tabela)
      setChave(definition.chave)
      setDesc(definition.descricao || '')
    } else {
      setNome('')
      setChave('')
      setDesc('')
    }
  }, [definition, isOpen])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const payload = { nome_tabela: nome, chave, descricao: desc }
    let error

    if (definition) {
      const res = await supabase
        .from('tabelas_sistema_definicoes')
        .update(payload)
        .eq('id', definition.id)
      error = res.error
    } else {
      const res = await supabase.from('tabelas_sistema_definicoes').insert([payload])
      error = res.error
    }

    setSaving(false)
    if (error) {
      toast({ variant: 'destructive', title: 'Erro', description: error.message })
    } else {
      toast({ title: 'Sucesso', description: 'Definição da tabela salva com sucesso.' })
      onSaved()
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {definition ? 'Editar Tabela Global' : 'Nova Tabela do Sistema'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Nome da Tabela</Label>
            <Input
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Categorias de Risco"
            />
          </div>
          <div className="space-y-2">
            <Label>Chave do Sistema (Identificador único)</Label>
            <Input
              required
              value={chave}
              onChange={(e) => setChave(e.target.value)}
              placeholder="Ex: risk_categories"
              disabled={!!definition}
            />
          </div>
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Descreva a finalidade desta tabela."
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Salvar Tabela
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
