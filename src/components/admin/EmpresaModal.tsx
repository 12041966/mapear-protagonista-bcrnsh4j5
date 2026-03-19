import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Tables } from '@/lib/supabase/types'

type Empresa = Tables<'empresas'>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  empresa: Empresa | null
  onSuccess: () => void
}

const INITIAL_STATE = { nome: '', cnpj: '', email_contato: '', telefone: '' }

export function EmpresaModal({ open, onOpenChange, empresa, onSuccess }: Props) {
  const [formData, setFormData] = useState(INITIAL_STATE)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (empresa && open) {
      setFormData({
        nome: empresa.nome || '',
        cnpj: empresa.cnpj || '',
        email_contato: empresa.email_contato || '',
        telefone: empresa.telefone || '',
      })
    } else if (open) {
      setFormData(INITIAL_STATE)
    }
  }, [empresa, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.nome.trim()) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'O nome da empresa é obrigatório.',
      })
      return
    }

    setLoading(true)
    let error

    if (empresa) {
      const { error: updateError } = await supabase
        .from('empresas')
        .update(formData)
        .eq('id', empresa.id)
      error = updateError
    } else {
      const { error: insertError } = await supabase
        .from('empresas')
        .insert([{ ...formData, ativa: true }])
      error = insertError
    }

    setLoading(false)

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível salvar os dados da empresa.',
      })
    } else {
      toast({
        title: 'Sucesso',
        description: `Empresa ${empresa ? 'atualizada' : 'cadastrada'} com sucesso.`,
      })
      onSuccess()
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{empresa ? 'Editar Empresa' : 'Nova Empresa'}</DialogTitle>
            <DialogDescription>
              {empresa
                ? 'Atualize os dados da empresa abaixo.'
                : 'Preencha os dados para cadastrar uma nova empresa no sistema.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome da Empresa *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData((prev) => ({ ...prev, nome: e.target.value }))}
                placeholder="Ex: Indústrias ABC Ltda"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                value={formData.cnpj}
                onChange={(e) => setFormData((prev) => ({ ...prev, cnpj: e.target.value }))}
                placeholder="00.000.000/0000-00"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email de Contato</Label>
              <Input
                id="email"
                type="email"
                value={formData.email_contato}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email_contato: e.target.value }))
                }
                placeholder="contato@empresa.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData((prev) => ({ ...prev, telefone: e.target.value }))}
                placeholder="(00) 0000-0000"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
