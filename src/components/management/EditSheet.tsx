import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
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
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Observation, ObsStatus } from '@/types'
import { useMainStore } from '@/stores/main'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  obs: Observation | null
  open: boolean
  onOpenChange: (o: boolean) => void
}

export function EditSheet({ obs, open, onOpenChange }: Props) {
  const [status, setStatus] = useState<ObsStatus>('Pendente')
  const [assignedTo, setAssignedTo] = useState('')
  const [comments, setComments] = useState('')
  const [justificativa, setJustificativa] = useState('')
  const [dueDate, setDueDate] = useState<Date | undefined>()
  const [completionDate, setCompletionDate] = useState<Date | undefined>()
  const [isSaving, setIsSaving] = useState(false)
  const { updateObservation } = useMainStore()
  const { toast } = useToast()

  useEffect(() => {
    if (obs) {
      let defaultStatus = obs.status
      let defaultCompletion = obs.completionDate ? new Date(obs.completionDate) : undefined

      if (
        obs.type.toLowerCase().includes('comportamento') &&
        obs.resolutionType === 'Feedback fornecido'
      ) {
        if (defaultStatus !== 'Concluído') {
          defaultStatus = 'Concluído'
        }
        if (!obs.completionDate) {
          defaultCompletion = new Date(obs.date)
        }
      }

      setStatus(defaultStatus)
      setAssignedTo(obs.assignedTo || '')
      setComments((obs as any).managerComments || '')
      setJustificativa('')
      setDueDate(obs.dueDate ? new Date(obs.dueDate) : undefined)
      setCompletionDate(defaultCompletion)
    }
  }, [obs])

  if (!obs) return null

  const handleStatusChange = (val: ObsStatus) => {
    setStatus(val)
    if (val === 'Concluído' && !completionDate) {
      setCompletionDate(new Date())
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    const updates: any = {
      status,
      assignedTo,
      managerComments: comments,
      dueDate: dueDate ? dueDate.toISOString() : null,
      completionDate: completionDate ? completionDate.toISOString() : null,
    }

    if (status !== obs.status) {
      updates.justificativa_status = justificativa
    }

    await updateObservation(obs.id, updates)
    setIsSaving(false)

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

  const statusChanged = obs && status !== obs.status

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
              <Select value={status} onValueChange={handleStatusChange}>
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

            {statusChanged && (
              <div className="grid gap-2 animate-in fade-in slide-in-from-top-2">
                <Label className="text-primary">Justificativa da mudança de status</Label>
                <Textarea
                  value={justificativa}
                  onChange={(e) => setJustificativa(e.target.value)}
                  placeholder="Informe o motivo da alteração de status..."
                  className="min-h-[80px]"
                  required
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label>Atribuir a (Responsável)</Label>
              <Input
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                placeholder="Ex: Manutenção Elétrica, João..."
              />
            </div>

            <div className="grid gap-2">
              <Label>Prazo</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !dueDate && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? (
                      format(dueDate, "dd 'de' MMMM, yyyy", { locale: ptBR })
                    ) : (
                      <span>Definir prazo...</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label>Conclusão</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !completionDate && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {completionDate ? (
                      format(completionDate, "dd 'de' MMMM, yyyy", { locale: ptBR })
                    ) : (
                      <span>Definir conclusão...</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={completionDate}
                    onSelect={setCompletionDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
          <Button
            onClick={handleSave}
            disabled={isSaving || (statusChanged && !justificativa.trim())}
            className="w-full"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...
              </>
            ) : (
              'Salvar Alterações'
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
