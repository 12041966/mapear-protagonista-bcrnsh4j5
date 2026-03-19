import { useState, useEffect } from 'react'
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
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

export function UsersList() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('profiles').select('*').order('name')
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
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    // Atualização otimista na interface
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))

    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId)

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar perfil',
        description: error.message,
      })
      // Reverte se falhar
      fetchUsers()
    } else {
      toast({
        title: 'Perfil atualizado',
        description: 'O nível de acesso foi alterado com sucesso.',
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">
          Gerencie acessos e perfis dos usuários da plataforma.
        </p>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Matrícula</TableHead>
              <TableHead>Perfil de Acesso</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="flex items-center justify-center text-slate-500">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Carregando usuários...
                  </div>
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => (
                <TableRow key={u.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-medium">{u.name || '-'}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.cpf || '-'}</TableCell>
                  <TableCell>{u.company_id || '-'}</TableCell>
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
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
