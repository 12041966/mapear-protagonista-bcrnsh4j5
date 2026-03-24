import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Edit2, Plus, Upload } from 'lucide-react'
import { EditUserDialog } from './EditUserDialog'
import { ImportUsersDialog } from './ImportUsersDialog'
import { useMainStore } from '@/stores/main'
import { formatPhone } from '@/lib/utils'

export function UsersList() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<any | null>(null)

  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)

  const [inviteName, setInviteName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteWhatsapp, setInviteWhatsapp] = useState('')
  const [inviteRole, setInviteRole] = useState('Observador')
  const [inviting, setInviting] = useState(false)

  const { toast } = useToast()
  const { currentUser, isSuperAdmin, activeCompanyId } = useMainStore()

  const targetCompanyId =
    isSuperAdmin && activeCompanyId !== 'all' ? activeCompanyId : currentUser?.companyId

  const fetchUsers = useCallback(async () => {
    if (!isSuperAdmin && !currentUser?.companyId) return
    setLoading(true)

    let query = supabase.from('profiles').select('*, empresas(nome)').order('name')

    if (isSuperAdmin && activeCompanyId === 'all') {
      query = query.eq('email', 'ferbatsan@hotmail.com')
    } else if (targetCompanyId) {
      query = query.eq('empresa_id', targetCompanyId)
    }

    const { data, error } = await query

    if (data) {
      setUsers(data)
    } else if (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar usuários',
        description: error.message,
      })
    }
    setLoading(false)
  }, [isSuperAdmin, activeCompanyId, targetCompanyId, currentUser?.companyId, toast])

  useEffect(() => {
    if (currentUser?.role === 'Administrador' || isSuperAdmin) {
      fetchUsers()
    }
  }, [currentUser, isSuperAdmin, fetchUsers])

  const handleRoleChange = async (userId: string, newRole: string) => {
    const oldUser = users.find((u) => u.id === userId)
    if (!oldUser) return
    const oldRole = oldUser.role

    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))

    let query = supabase.from('profiles').update({ role: newRole }).eq('id', userId)
    if (!isSuperAdmin) query = query.eq('empresa_id', currentUser?.companyId)

    const { error } = await query

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar perfil',
        description: error.message,
      })
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: oldRole } : u)))
    } else {
      toast({
        title: 'Perfil atualizado',
        description: 'O nível de acesso foi alterado com sucesso.',
      })
    }
  }

  const handleToggleStatus = async (user: any) => {
    const newStatus = !user.active
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, active: newStatus } : u)))

    let query = supabase.from('profiles').update({ active: newStatus }).eq('id', user.id)
    if (!isSuperAdmin) query = query.eq('empresa_id', currentUser?.companyId)

    const { error } = await query

    if (error) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Falha ao alterar status.' })
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, active: user.active } : u)))
    } else {
      toast({
        title: 'Sucesso',
        description: `Acesso do usuário ${newStatus ? 'ativado' : 'desativado'}.`,
      })
    }
  }

  const handleSaveUser = async (userId: string, updates: any) => {
    const { error } = await supabase.from('profiles').update(updates).eq('id', userId)

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar usuário',
        description:
          error.code === '23505'
            ? 'A matrícula informada já existe na base de dados.'
            : error.message,
      })
    } else {
      toast({
        title: 'Usuário atualizado',
        description: 'Os dados do usuário foram salvos com sucesso.',
      })
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...updates } : u)))
    }
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail || !inviteName) return

    if (inviteWhatsapp) {
      const digitsOnly = inviteWhatsapp.replace(/\D/g, '')
      if (digitsOnly.length < 10 || digitsOnly.length > 11) {
        toast({
          variant: 'destructive',
          title: 'WhatsApp inválido',
          description: 'O número deve conter o DDD e ser válido.',
        })
        return
      }
    }

    setInviting(true)
    const { data, error } = await supabase.functions.invoke('invite-user', {
      body: {
        email: inviteEmail,
        name: inviteName,
        role: inviteRole,
        whatsapp: inviteWhatsapp,
        empresa_id: targetCompanyId,
      },
    })

    setInviting(false)

    if (error || data?.error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao convidar',
        description: data?.error || error?.message || 'Falha ao enviar convite.',
      })
    } else {
      toast({
        title: 'Convite enviado',
        description: `Um email com instruções foi enviado para ${inviteEmail}.`,
      })
      setIsInviteOpen(false)
      setInviteName('')
      setInviteEmail('')
      setInviteWhatsapp('')
      setInviteRole('Observador')
      fetchUsers()
    }
  }

  const canInvite = isSuperAdmin ? activeCompanyId !== 'all' : true
  const columnsCount = isSuperAdmin && activeCompanyId === 'all' ? 8 : 7

  const emptyMessage =
    isSuperAdmin && activeCompanyId === 'all'
      ? 'Nenhum administrador global encontrado.'
      : 'Nenhum usuário encontrado para a empresa selecionada.'

  const headerText =
    isSuperAdmin && activeCompanyId === 'all'
      ? 'Gerencie os acessos dos administradores da plataforma.'
      : 'Gerencie acessos, informações e convites dos usuários da empresa.'

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-sm text-slate-500">{headerText}</p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsImportOpen(true)}
            disabled={!canInvite}
            title={!canInvite ? 'Selecione uma empresa para importar usuários' : ''}
            className="flex items-center gap-2 shadow-sm"
          >
            <Upload className="w-4 h-4" />
            Importar CSV
          </Button>
          <Button
            onClick={() => setIsInviteOpen(true)}
            disabled={!canInvite}
            title={!canInvite ? 'Selecione uma empresa para convidar usuários' : ''}
            className="flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Convidar Usuário
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>Matrícula</TableHead>
              {isSuperAdmin && activeCompanyId === 'all' && <TableHead>Empresa</TableHead>}
              <TableHead>Perfil</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columnsCount} className="text-center py-8">
                  <div className="flex items-center justify-center text-slate-500">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Carregando usuários...
                  </div>
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columnsCount} className="text-center py-8 text-slate-500">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => (
                <TableRow key={u.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-medium text-slate-900">{u.name || '-'}</TableCell>
                  <TableCell className="text-slate-600">{u.email}</TableCell>
                  <TableCell className="text-slate-600 whitespace-nowrap">
                    {u.whatsapp || '-'}
                  </TableCell>
                  <TableCell className="text-slate-600 whitespace-nowrap">
                    {u.registration_number || '-'}
                  </TableCell>
                  {isSuperAdmin && activeCompanyId === 'all' && (
                    <TableCell className="text-slate-600 text-xs">
                      {u.empresas?.nome || '-'}
                    </TableCell>
                  )}
                  <TableCell>
                    <Select
                      value={u.role || 'Observador'}
                      onValueChange={(val) => handleRoleChange(u.id, val)}
                    >
                      <SelectTrigger className="w-[160px] h-8 bg-white">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Administrador">Administrador</SelectItem>
                        <SelectItem value="Supervisor">Supervisor</SelectItem>
                        <SelectItem value="Observador">Observador</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Switch checked={u.active} onCheckedChange={() => handleToggleStatus(u)} />
                      <Badge
                        variant={u.active ? 'default' : 'secondary'}
                        className={
                          u.active ? 'bg-emerald-500 hover:bg-emerald-600' : 'text-slate-500'
                        }
                      >
                        {u.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingUser(u)}
                      className="text-slate-500 hover:text-primary hover:bg-primary/10"
                      title="Editar usuário"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <EditUserDialog
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        onSave={handleSaveUser}
        user={editingUser}
      />

      <ImportUsersDialog
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        targetCompanyId={targetCompanyId || ''}
        onSuccess={fetchUsers}
      />

      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Convidar Novo Usuário</DialogTitle>
            <DialogDescription>
              Preencha os dados abaixo para adicionar um novo membro à plataforma.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleInvite} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="inviteName">Nome Completo</Label>
              <Input
                id="inviteName"
                placeholder="Ex: João da Silva"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inviteEmail">Endereço de Email</Label>
              <Input
                id="inviteEmail"
                type="email"
                placeholder="nome@empresa.com.br"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inviteWhatsapp">WhatsApp (Opcional)</Label>
              <Input
                id="inviteWhatsapp"
                placeholder="(11) 99999-9999"
                value={inviteWhatsapp}
                onChange={(e) => setInviteWhatsapp(formatPhone(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inviteRole">Perfil de Acesso</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger id="inviteRole" className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Administrador">Administrador</SelectItem>
                  <SelectItem value="Supervisor">Supervisor</SelectItem>
                  <SelectItem value="Observador">Observador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsInviteOpen(false)}
                disabled={inviting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={inviting || !inviteEmail || !inviteName}>
                {inviting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar Convite'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
