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

export function GlobalOptDialog({ isOpen, onClose, option, tabelaId, onSaved }: any) {
  const [nome, setNome] = useState('')
  const [valor, setValor] = useState('')
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (option) {
      setNome(option.nome_opcao)
      setValor(option.valor_padrao)
    } else {
      setNome('')
      setValor('')
    }
  }, [option, isOpen])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const payload = { nome_opcao: nome, valor_padrao: valor, tabela_id: tabelaId }
    let error

    if (option) {
      const res = await supabase
        .from('tabelas_sistema_opcoes')
        .update({ nome_opcao: nome, valor_padrao: valor })
        .eq('id', option.id)
      error = res.error
    } else {
      const res = await supabase.from('tabelas_sistema_opcoes').insert([payload])
      error = res.error
    }

    setSaving(false)
    if (error) {
      toast({ variant: 'destructive', title: 'Erro', description: error.message })
    } else {
      toast({ title: 'Sucesso', description: 'Opção padrão salva com sucesso.' })
      onSaved()
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{option ? 'Editar Opção Padrão' : 'Nova Opção Padrão'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Nome / Rótulo de Exibição</Label>
            <Input
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Baixo Risco"
            />
          </div>
          <div className="space-y-2">
            <Label>Valor Padrão (Texto simples ou formato JSON)</Label>
            <Textarea
              required
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder='Ex: Baixo Risco ou {"value": "baixo", "desc": "..."}'
              className="font-mono text-sm min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Salvar Opção
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
