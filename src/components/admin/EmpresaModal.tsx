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
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Tables } from '@/lib/supabase/types'
import { Loader2 } from 'lucide-react'

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
  const [admins, setAdmins] = useState<any[]>([])
  const [selectedAdmins, setSelectedAdmins] = useState<string[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchAdmins = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, name, email, empresa_id')
        .eq('role', 'Administrador')
        .order('name')

      if (data) {
        setAdmins(data)
        if (empresa) {
          setSelectedAdmins(data.filter((a) => a.empresa_id === empresa.id).map((a) => a.id))
        } else {
          setSelectedAdmins([])
        }
      }
    }
    if (open) fetchAdmins()
  }, [open, empresa])

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
    let targetEmpresaId = empresa?.id

    if (empresa) {
      const { error: updateError } = await supabase
        .from('empresas')
        .update(formData)
        .eq('id', empresa.id)
      error = updateError
    } else {
      const { data, error: insertError } = await supabase
        .from('empresas')
        .insert([{ ...formData, ativa: true }])
        .select()
      error = insertError
      if (data && data.length > 0) {
        targetEmpresaId = data[0].id
      }
    }

    let profileError: any = null

    if (!error && targetEmpresaId) {
      if (empresa) {
        const originallySelected = admins
          .filter((a) => a.empresa_id === empresa.id)
          .map((a) => a.id)
        const toRemove = originallySelected.filter((id) => !selectedAdmins.includes(id))
        if (toRemove.length > 0) {
          const { error: rmErr } = await supabase
            .from('profiles')
            .update({ empresa_id: null })
            .in('id', toRemove)
          if (rmErr) profileError = rmErr
        }
      }

      if (!profileError && selectedAdmins.length > 0) {
        const { error: addErr } = await supabase
          .from('profiles')
          .update({ empresa_id: targetEmpresaId })
          .in('id', selectedAdmins)
        if (addErr) profileError = addErr
      }
    }

    setLoading(false)

    if (error || profileError) {
      const isUniqueConflict =
        profileError?.code === '23505' ||
        profileError?.message?.includes('profiles_email_empresa_id_key')

      toast({
        variant: 'destructive',
        title: 'Erro',
        description: isUniqueConflict
          ? 'Não foi possível vincular o administrador: este e-mail já possui um perfil ativo nesta empresa.'
          : 'Não foi possível salvar os dados da empresa.',
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
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{empresa ? 'Editar Empresa' : 'Nova Empresa'}</DialogTitle>
            <DialogDescription>
              {empresa
                ? 'Atualize os dados e vincule administradores da empresa.'
                : 'Preencha os dados e vincule administradores no sistema.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            {empresa?.codigo_empresa && (
              <div className="grid gap-2">
                <Label>Código da Empresa</Label>
                <div className="flex h-10 w-full items-center rounded-md border border-input bg-slate-100/50 px-3 py-2 text-sm text-slate-500 font-mono">
                  {empresa.codigo_empresa}
                </div>
              </div>
            )}
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
            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, telefone: e.target.value }))}
                  placeholder="(00) 0000-0000"
                />
              </div>
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

            <div className="grid gap-2 pt-2 border-t mt-2">
              <Label>Administradores Associados</Label>
              <ScrollArea className="h-40 w-full border rounded-md p-3">
                {admins.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">
                    Nenhum perfil "Administrador" encontrado.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {admins.map((admin) => (
                      <div key={admin.id} className="flex flex-row items-start space-x-3">
                        <Checkbox
                          id={`admin-${admin.id}`}
                          checked={selectedAdmins.includes(admin.id)}
                          onCheckedChange={(checked) => {
                            if (checked) setSelectedAdmins((prev) => [...prev, admin.id])
                            else setSelectedAdmins((prev) => prev.filter((id) => id !== admin.id))
                          }}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor={`admin-${admin.id}`}
                            className="text-sm font-medium leading-none cursor-pointer"
                          >
                            {admin.name}
                          </label>
                          <p className="text-xs text-slate-500">{admin.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
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
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
