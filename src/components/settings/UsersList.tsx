import { useState } from 'react'
import { useMainStore } from '@/stores/main'
import { UserProfile } from '@/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
import { Edit2 } from 'lucide-react'

export function UsersList() {
  const { users, updateUser } = useMainStore()
  const [editing, setEditing] = useState<UserProfile | null>(null)

  const handleSave = () => {
    if (editing) updateUser(editing.id, editing)
    setEditing(null)
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>CPF</TableHead>
            <TableHead>ID Empresa</TableHead>
            <TableHead>WhatsApp</TableHead>
            <TableHead className="text-right">Ação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id} className="hover:bg-slate-50/50">
              <TableCell className="font-medium">{u.name}</TableCell>
              <TableCell>{u.cpf}</TableCell>
              <TableCell>{u.companyId}</TableCell>
              <TableCell>{u.whatsapp}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditing(u)}
                  className="text-primary"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Perfil: {editing?.name}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label>Nome Completo</Label>
                <Input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>CPF</Label>
                <Input
                  value={editing.cpf}
                  onChange={(e) => setEditing({ ...editing, cpf: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>ID da Empresa (Matrícula)</Label>
                <Input
                  value={editing.companyId}
                  onChange={(e) => setEditing({ ...editing, companyId: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>WhatsApp</Label>
                <Input
                  value={editing.whatsapp}
                  onChange={(e) => setEditing({ ...editing, whatsapp: e.target.value })}
                />
              </div>
              <Button onClick={handleSave} className="w-full mt-4">
                Salvar Alterações
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
