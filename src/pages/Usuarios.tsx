import { useState, useEffect, useCallback } from 'react'
import { Navigate } from 'react-router-dom'
import { Users, Plus, Loader2 } from 'lucide-react'
import { useMainStore } from '@/stores/main'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

export default function Usuarios() {
  const { currentUser, isSuperAdmin, activeCompanyId } = useMainStore()
  const { toast } = useToast()

  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [inviteName, setInviteName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('Observador')
  const [inviting, setInviting] = useState(false)

  const targetCompanyId =
    isSuperAdmin && activeCompanyId !== 'all' ? activeCompanyId : currentUser?.companyId

  const fetchUsers = useCallback(async () => {
    if (!targetCompanyId && !isSuperAdmin) return

    setLoading(true)
    let query = supabase.from('profiles').select('*, empresas(nome)').order('name')

    if (targetCompanyId) {
      query = query.eq('empresa_id', targetCompanyId)
    }

    const { data, error } = await query

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível carregar a lista de usuários.',
      })
    } else {
      setUsers(data || [])
    }
    setLoading(false)
  }, [targetCompanyId, isSuperAdmin, toast])

  useEffect(() => {
    if (currentUser?.role === 'Administrador' || isSuperAdmin) {
      fetchUsers()
    }
  }, [currentUser, isSuperAdmin, fetchUsers])

  if (currentUser?.role !== 'Administrador' && !isSuperAdmin) {
    return <Navigate to="/" replace />
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

  const handleChangeRole = async (user: any, newRole: string) => {
    const oldRole = user.role
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)))

    let query = supabase.from('profiles').update({ role: newRole }).eq('id', user.id)
    if (!isSuperAdmin) query = query.eq('empresa_id', currentUser?.companyId)

    const { error } = await query

    if (error) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Falha ao alterar perfil.' })
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role: oldRole } : u)))
    } else {
      toast({ title: 'Sucesso', description: 'Perfil atualizado com sucesso.' })
    }
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail || !inviteName) return

    setInviting(true)
    const { data, error } = await supabase.functions.invoke('invite-user', {
      body: {
        email: inviteEmail,
        name: inviteName,
        role: inviteRole,
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
      setInviteRole('Observador')
      fetchUsers()
    }
  }

  const canInvite = isSuperAdmin ? activeCompanyId !== 'all' : true

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            Gestão de Usuários
          </h2>
          <p className="text-sm text-slate-500">
            Gerencie os acessos, permissões e convites da sua equipe.
          </p>
        </div>
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

      <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              {isSuperAdmin && activeCompanyId === 'all' && <TableHead>Empresa</TableHead>}
              <TableHead>Perfil</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={isSuperAdmin && activeCompanyId === 'all' ? 5 : 4}
                  className="text-center py-12 text-slate-500"
                >
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Carregando equipe...
                  </div>
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={isSuperAdmin && activeCompanyId === 'all' ? 5 : 4}
                  className="text-center py-12 text-slate-500"
                >
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-medium text-slate-900">{user.name}</TableCell>
                  <TableCell className="text-slate-600">{user.email}</TableCell>
                  {isSuperAdmin && activeCompanyId === 'all' && (
                    <TableCell className="text-slate-600 text-xs">
                      {user.empresas?.nome || '-'}
                    </TableCell>
                  )}
                  <TableCell>
                    <Select value={user.role} onValueChange={(val) => handleChangeRole(user, val)}>
                      <SelectTrigger className="w-[160px] h-8 bg-white">
                        <SelectValue />
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
                      <Switch
                        checked={user.active}
                        onCheckedChange={() => handleToggleStatus(user)}
                      />
                      <Badge
                        variant={user.active ? 'default' : 'secondary'}
                        className={
                          user.active ? 'bg-emerald-500 hover:bg-emerald-600' : 'text-slate-500'
                        }
                      >
                        {user.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

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
