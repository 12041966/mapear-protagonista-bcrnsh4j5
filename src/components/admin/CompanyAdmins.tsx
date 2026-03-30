import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Plus, Loader2, Edit2 } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'

export function CompanyAdmins() {
  const [admins, setAdmins] = useState<any[]>([])
  const [empresas, setEmpresas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteData, setInviteData] = useState({ name: '', email: '', empresa_id: '' })
  const [inviting, setInviting] = useState(false)

  const [editOpen, setEditOpen] = useState(false)
  const [editData, setEditData] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  const { toast } = useToast()

  const fetchAll = useCallback(async () => {
    setLoading(true)
    const [admRes, empRes] = await Promise.all([
      supabase
        .from('profiles')
        .select('*, empresas(nome)')
        .or('role.eq.Administrador,is_super_admin.eq.true')
        .order('name'),
      supabase.from('empresas').select('id, nome').eq('ativa', true).order('nome'),
    ])
    if (admRes.data) setAdmins(admRes.data)
    if (empRes.data) setEmpresas(empRes.data)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setInviting(true)
    const { data, error } = await supabase.functions.invoke('invite-user', {
      body: { ...inviteData, role: 'Administrador' },
    })
    setInviting(false)
    if (error || data?.error) {
      toast({ variant: 'destructive', title: 'Erro', description: data?.error || error?.message })
    } else {
      toast({ title: 'Sucesso', description: 'Convite enviado.' })
      setInviteOpen(false)
      setInviteData({ name: '', email: '', empresa_id: '' })
      fetchAll()
    }
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editData) return
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({
        name: editData.name,
        empresa_id: editData.empresa_id === 'none' ? null : editData.empresa_id,
        is_super_admin: editData.is_super_admin,
        role: 'Administrador',
      })
      .eq('id', editData.id)

    setSaving(false)

    if (error) {
      toast({ variant: 'destructive', title: 'Erro', description: error.message })
    } else {
      toast({ title: 'Sucesso', description: 'Administrador atualizado.' })
      setEditOpen(false)
      fetchAll()
    }
  }

  const handleToggleStatus = async (admin: any) => {
    const newStatus = !admin.active
    setAdmins((prev) => prev.map((a) => (a.id === admin.id ? { ...a, active: newStatus } : a)))
    const { error } = await supabase
      .from('profiles')
      .update({ active: newStatus })
      .eq('id', admin.id)
    if (error) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Falha ao alterar status.' })
      fetchAll()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <p className="text-sm text-slate-500">
          Gerencie os administradores e seus acessos globais às empresas.
        </p>
        <Button onClick={() => setInviteOpen(true)} size="sm" className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo Administrador
        </Button>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Empresa Vinculada</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto text-slate-400" />
                </TableCell>
              </TableRow>
            ) : admins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                  Nenhum administrador encontrado.
                </TableCell>
              </TableRow>
            ) : (
              admins.map((adm) => (
                <TableRow key={adm.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-medium">{adm.name}</TableCell>
                  <TableCell>{adm.email}</TableCell>
                  <TableCell>
                    {adm.empresas?.nome || (
                      <span className="text-slate-400 italic">Sem empresa</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        adm.is_super_admin
                          ? 'bg-primary/10 text-primary border-primary/20'
                          : 'bg-slate-100 text-slate-700'
                      }
                    >
                      {adm.is_super_admin ? 'Super Admin' : 'Admin'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={adm.active ? 'default' : 'secondary'}
                      className={adm.active ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
                    >
                      {adm.active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Switch
                        checked={adm.active}
                        onCheckedChange={() => handleToggleStatus(adm)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditData({ ...adm })
                          setEditOpen(true)
                        }}
                        className="h-8 px-2 text-primary"
                      >
                        <Edit2 className="w-4 h-4 mr-1" /> Editar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <form onSubmit={handleInvite}>
            <DialogHeader>
              <DialogTitle>Convidar Administrador</DialogTitle>
              <DialogDescription>
                O usuário receberá um convite por e-mail com perfil de Administrador para a empresa
                selecionada.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Nome Completo</Label>
                <Input
                  required
                  value={inviteData.name}
                  onChange={(e) => setInviteData((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input
                  required
                  type="email"
                  value={inviteData.email}
                  onChange={(e) => setInviteData((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label>Empresa Vinculada</Label>
                <Select
                  required
                  value={inviteData.empresa_id || 'none'}
                  onValueChange={(v) =>
                    setInviteData((prev) => ({ ...prev, empresa_id: v === 'none' ? '' : v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Selecione a empresa</SelectItem>
                    {empresas.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setInviteOpen(false)}
                disabled={inviting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={inviting || !inviteData.empresa_id || inviteData.empresa_id === 'none'}
              >
                {inviting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Enviar Convite
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <form onSubmit={handleSaveEdit}>
            <DialogHeader>
              <DialogTitle>Editar Administrador</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Nome Completo</Label>
                <Input
                  required
                  value={editData?.name || ''}
                  onChange={(e) => setEditData((prev: any) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input
                  disabled
                  value={editData?.email || ''}
                  className="bg-slate-100 text-slate-500"
                />
              </div>
              <div className="grid gap-2">
                <Label>Perfil de Acesso</Label>
                <Select
                  required
                  value={editData?.is_super_admin ? 'super_admin' : 'admin'}
                  onValueChange={(v) =>
                    setEditData((prev: any) => ({
                      ...prev,
                      is_super_admin: v === 'super_admin',
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin (Apenas Empresa)</SelectItem>
                    <SelectItem value="super_admin">Super Admin (Acesso Global)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Empresa Vinculada</Label>
                <Select
                  required={!editData?.is_super_admin}
                  value={editData?.empresa_id || 'none'}
                  onValueChange={(v) => setEditData((prev: any) => ({ ...prev, empresa_id: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhuma (Acesso Global)</SelectItem>
                    {empresas.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Salvar Alterações
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
