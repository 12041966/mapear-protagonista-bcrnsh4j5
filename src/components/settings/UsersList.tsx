import { useState } from 'react'
import { useMainStore } from '@/stores/main'
import { UserProfile, Role } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
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
import { Badge } from '@/components/ui/badge'
import { Edit2, Plus, Trash2 } from 'lucide-react'

export function UsersList() {
  const { users, updateUser, addUser, removeUser } = useMainStore()
  const [editing, setEditing] = useState<Partial<UserProfile> | null>(null)
  const [isNew, setIsNew] = useState(false)

  const staffUsers = users.filter((u) => u.role !== 'Observador')

  const handleSave = () => {
    if (!editing?.name || !editing?.role) return

    if (isNew) {
      addUser({
        id: `USR-${Date.now()}`,
        name: editing.name || '',
        cpf: editing.cpf || '',
        companyId: editing.companyId || '',
        whatsapp: editing.whatsapp || '',
        role: editing.role as Role,
      })
    } else if (editing.id) {
      updateUser(editing.id, editing)
    }
    setEditing(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">Gerencie acessos administrativos e de supervisão.</p>
        <Button
          onClick={() => {
            setIsNew(true)
            setEditing({ role: 'Supervisão' })
          }}
          className="flex gap-2"
        >
          <Plus className="w-4 h-4" /> Novo Acesso
        </Button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Matrícula</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staffUsers.map((u) => (
              <TableRow key={u.id} className="hover:bg-slate-50/50">
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell>
                  <Badge variant={u.role === 'Segurança' ? 'default' : 'outline'}>{u.role}</Badge>
                </TableCell>
                <TableCell>{u.cpf}</TableCell>
                <TableCell>{u.companyId}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIsNew(false)
                      setEditing(u)
                    }}
                  >
                    <Edit2 className="w-4 h-4 text-primary" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => removeUser(u.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {staffUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-slate-500">
                  Nenhum acesso cadastrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isNew ? 'Novo Acesso' : `Editar: ${editing?.name}`}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label>Nome Completo</Label>
              <Input
                value={editing?.name || ''}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Perfil de Acesso</Label>
              <Select
                value={editing?.role}
                onValueChange={(val) => setEditing({ ...editing, role: val as Role })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Segurança">Segurança (Administrador)</SelectItem>
                  <SelectItem value="Supervisão">Supervisão (Tratamento)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>CPF</Label>
                <Input
                  value={editing?.cpf || ''}
                  onChange={(e) => setEditing({ ...editing, cpf: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Matrícula</Label>
                <Input
                  value={editing?.companyId || ''}
                  onChange={(e) => setEditing({ ...editing, companyId: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>WhatsApp</Label>
              <Input
                value={editing?.whatsapp || ''}
                onChange={(e) => setEditing({ ...editing, whatsapp: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave} className="w-full">
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
