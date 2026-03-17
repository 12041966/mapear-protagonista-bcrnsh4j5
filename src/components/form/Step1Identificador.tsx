import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
  data: any
  updateData: (data: any) => void
}

export function Step1Identificador({ data, updateData }: Props) {
  return (
    <div className="space-y-4 animate-slide-in-right">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Identificação do Observador</h3>
        <p className="text-sm text-slate-500">Seus dados para acompanhamento do relato.</p>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Nome Completo</Label>
          <Input
            id="name"
            placeholder="Ex: João da Silva"
            value={data.observer.name}
            onChange={(e) => updateData({ observer: { ...data.observer, name: e.target.value } })}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input
            id="whatsapp"
            placeholder="(00) 00000-0000"
            type="tel"
            value={data.observer.whatsapp}
            onChange={(e) =>
              updateData({ observer: { ...data.observer, whatsapp: e.target.value } })
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              placeholder="000.000.000-00"
              value={data.observer.cpf}
              onChange={(e) => updateData({ observer: { ...data.observer, cpf: e.target.value } })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="companyId">ID Empresa</Label>
            <Input
              id="companyId"
              placeholder="Matrícula"
              value={data.observer.companyId}
              onChange={(e) =>
                updateData({ observer: { ...data.observer, companyId: e.target.value } })
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}
