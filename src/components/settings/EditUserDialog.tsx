import { useState, useEffect } from 'react'
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

interface EditUserDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (id: string, updates: any) => Promise<void>
  user: any | null
}

export function EditUserDialog({ isOpen, onClose, onSave, user }: EditUserDialogProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [cpf, setCpf] = useState('')
  const [registrationNumber, setRegistrationNumber] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (user && isOpen) {
      setName(user.name || '')
      setEmail(user.email || '')
      setCpf(user.cpf || '')
      setRegistrationNumber(user.registration_number || '')
    }
  }, [user, isOpen])

  const handleSave = async () => {
    if (!user) return
    setIsSaving(true)
    await onSave(user.id, {
      name,
      email,
      cpf,
      registration_number: registrationNumber,
    })
    setIsSaving(false)
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
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              placeholder="000.000.000-00"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="registration">Matrícula</Label>
            <Input
              id="registration"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              placeholder="Registro do funcionário"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
