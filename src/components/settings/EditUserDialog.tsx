import { useState, useEffect, useContext } from 'react'
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
import { useToast } from '@/hooks/use-toast'
import { formatPhone } from '@/lib/utils'
import { supabase } from '@/lib/supabase/client'
import { StoreContext } from '@/stores/main'

interface EditUserDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (id: string, updates: any) => Promise<void>
  user: any | null
}

export function EditUserDialog({ isOpen, onClose, onSave, user }: EditUserDialogProps) {
  const { toast } = useToast()
  const { removeUser } = useContext(StoreContext) as any
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [registrationNumber, setRegistrationNumber] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

  useEffect(() => {
    if (user && isOpen) {
      setName(user.name || '')
      setEmail(user.email || '')
      setWhatsapp(user.whatsapp || '')
      setRegistrationNumber(user.registration_number || '')
      setIsConfirmingDelete(false)
    }
  }, [user, isOpen])

  const handleSave = async () => {
    if (!user) return

    if (whatsapp) {
      const digitsOnly = whatsapp.replace(/\D/g, '')
      if (digitsOnly.length > 0 && (digitsOnly.length < 10 || digitsOnly.length > 11)) {
        toast({
          variant: 'destructive',
          title: 'Número inválido',
          description: 'O WhatsApp deve conter o DDD e o número válido (10 ou 11 dígitos).',
        })
        return
      }
    }

    setIsSaving(true)
    await onSave(user.id, {
      name,
      email,
      whatsapp,
      registration_number: registrationNumber,
    })
    setIsSaving(false)
    onClose()
  }

  const handleDeleteCheck = async () => {
    if (!user) return

    if (user.status === 'pendente_confirmacao' || user.status === 'pendente') {
      toast({
        variant: 'destructive',
        title: 'Ação não permitida',
        description: 'Não é possível excluir um usuário com convite pendente.',
      })
      return
    }

    setIsDeleting(true)
    const { data, error } = await supabase
      .from('observacoes')
      .select('id')
      .eq('user_id', user.id)
      .limit(1)

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível verificar as observações do usuário.',
      })
      setIsDeleting(false)
      return
    }

    if (data && data.length > 0) {
      toast({
        variant: 'destructive',
        title: 'Ação não permitida',
        description: 'Esse usuário tem observação registrada',
      })
      setIsDeleting(false)
      return
    }

    setIsDeleting(false)
    setIsConfirmingDelete(true)
  }

  const confirmDelete = async () => {
    if (!user) return
    setIsDeleting(true)

    const { error } = await supabase.from('profiles').delete().eq('id', user.id)

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir',
        description: 'Não foi possível excluir o usuário. Tente novamente mais tarde.',
      })
      setIsDeleting(false)
      return
    }

    toast({
      title: 'Usuário excluído',
      description: 'O usuário foi removido com sucesso.',
    })

    if (removeUser) {
      removeUser(user.id)
    }
    setIsDeleting(false)
    setIsConfirmingDelete(false)
    onClose()
  }

  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: João da Silva"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="joao@exemplo.com"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input
              id="whatsapp"
              value={whatsapp}
              onChange={(e) => setWhatsapp(formatPhone(e.target.value))}
              placeholder="(11) 99999-9999"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="registration">Matrícula (ID do Funcionário)</Label>
            <Input
              id="registration"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              placeholder="Registro do funcionário"
            />
          </div>
        </div>
        <DialogFooter className="flex w-full mt-2">
          {isConfirmingDelete ? (
            <div className="flex flex-col w-full gap-3">
              <span className="text-sm text-destructive font-medium">
                Tem certeza que deseja excluir este usuário?
              </span>
              <div className="flex w-full gap-2 sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsConfirmingDelete(false)}
                  disabled={isDeleting}
                  className="flex-1 sm:flex-none"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 sm:flex-none"
                >
                  {isDeleting ? 'Excluindo...' : 'Sim, Excluir'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col-reverse sm:flex-row w-full justify-between gap-2">
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteCheck}
                disabled={isSaving || isDeleting}
                className="w-full sm:w-auto"
              >
                Excluir Usuário
              </Button>
              <div className="flex gap-2 w-full sm:w-auto justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSaving || isDeleting}
                  className="flex-1 sm:flex-none"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving || isDeleting}
                  className="flex-1 sm:flex-none"
                >
                  {isSaving ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
