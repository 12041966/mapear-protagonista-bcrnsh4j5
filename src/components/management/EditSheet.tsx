import { useState, useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Observation, ObsStatus } from '@/types'
import { useMainStore } from '@/stores/main'
import { useToast } from '@/hooks/use-toast'

interface Props {
  obs: Observation | null
  open: boolean
  onOpenChange: (o: boolean) => void
}

export function EditSheet({ obs, open, onOpenChange }: Props) {
  const [status, setStatus] = useState<ObsStatus>('Pendente')
  const [assignedTo, setAssignedTo] = useState('')
  const [comments, setComments] = useState('')
  const { updateObservation } = useMainStore()
  const { toast } = useToast()

  useEffect(() => {
    if (obs) {
      setStatus(obs.status)
      setAssignedTo(obs.assignedTo || '')
      setComments(obs.managerComments || '')
    }
  }, [obs])

  if (!obs) return null

  const handleSave = () => {
    updateObservation(obs.id, {
      status,
      assignedTo,
      managerComments: comments,
    })

    if (status === 'Concluído' && obs.status !== 'Concluído') {
      toast({
        title: 'Relato Concluído',
        description: `Notificação enviada para o WhatsApp de ${obs.observer.name}.`,
      })
    } else {
      toast({ title: 'Atualizado', description: 'Alterações salvas com sucesso.' })
    }

    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Tratar Relato {obs.id}</SheetTitle>
          <SheetDescription>Modifique o status e atribua responsáveis.</SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-lg space-y-3 border text-sm">
            <div className="grid grid-cols-2 gap-2">
              <span className="text-slate-500">Observador:</span>
              <span className="font-medium">{obs.observer.name}</span>
              <span className="text-slate-500">Local:</span>
              <span className="font-medium">
                {obs.area} - {obs.shift}
              </span>
              <span className="text-slate-500">Tipo:</span>
              <span>
                <Badge variant="outline" className="text-[10px]">
                  {obs.type}
                </Badge>
              </span>
            </div>
            <div className="pt-2 border-t mt-2">
              <span className="text-slate-500 block mb-1">Descrição Original:</span>
              <p className="text-slate-700">{obs.description}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(val: ObsStatus) => setStatus(val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Em Análise">Em Análise</SelectItem>
                  <SelectItem value="Concluído">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Atribuir a (Responsável)</Label>
              <Input
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                placeholder="Ex: Manutenção Elétrica, João..."
              />
            </div>

            <div className="grid gap-2">
              <Label>Comentários da Gestão</Label>
              <Textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Anotações internas..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        </div>

        <SheetFooter className="mt-8">
          <Button onClick={handleSave} className="w-full">
            Salvar Alterações
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
