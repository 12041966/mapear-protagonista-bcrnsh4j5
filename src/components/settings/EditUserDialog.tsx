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
import { useToast } from '@/hooks/use-toast'
import { formatPhone } from '@/lib/utils'

interface EditUserDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (id: string, updates: any) => Promise<void>
  user: any | null
}

export function EditUserDialog({ isOpen, onClose, onSave, user }: EditUserDialogProps) {
  const { toast } = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [registrationNumber, setRegistrationNumber] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (user && isOpen) {
      setName(user.name || '')
      setEmail(user.email || '')
      setWhatsapp(user.whatsapp || '')
      setRegistrationNumber(user.registration_number || '')
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
