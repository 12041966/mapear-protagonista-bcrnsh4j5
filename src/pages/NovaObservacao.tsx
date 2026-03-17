import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import { useMainStore } from '@/stores/main'

import { Step1Identificador } from '@/components/form/Step1Identificador'
import { Step2Tipo } from '@/components/form/Step2Tipo'
import { Step3Detalhamento } from '@/components/form/Step3Detalhamento'
import { Step4Contexto } from '@/components/form/Step4Contexto'
import { Step5Avaliacao } from '@/components/form/Step5Avaliacao'

const INITIAL_DATA = {
  observer: { name: '', whatsapp: '', cpf: '', companyId: '' },
  type: undefined,
  detail: '',
  area: '',
  shift: '',
  machine: '',
  riskLevel: '',
  description: '',
  resolutionType: undefined,
  resolutionAction: '',
}

export default function NovaObservacao() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<any>(INITIAL_DATA)
  const { addObservation } = useMainStore()
  const { toast } = useToast()
  const navigate = useNavigate()

  const TOTAL_STEPS = 5
  const progress = (step / TOTAL_STEPS) * 100

  const updateData = (updates: any) => setData((prev: any) => ({ ...prev, ...updates }))

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep((s) => s + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1)
  }

  const handleSubmit = () => {
    const isCritical =
      data.type === 'Acidente' || data.type === 'Quase acidente' || data.riskLevel === 'Muito Grave'

    addObservation(data)

    if (isCritical) {
      toast({
        variant: 'destructive',
        title: 'Alerta Crítico Emitido',
        description: 'Notificação de alta prioridade enviada à gerência.',
      })
    } else {
      toast({
        title: 'Sucesso!',
        description: 'Observação registrada com sucesso.',
      })
    }

    navigate('/')
  }

  const isStepValid = () => {
    if (step === 1) return data.observer.name.length > 2
    if (step === 2) return !!data.type
    if (step === 3) return data.detail.length > 2
    if (step === 4) return !!data.area && !!data.shift
    if (step === 5) return data.description.length > 5 && !!data.resolutionType
    return false
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-4">
      <div className="mb-6 bg-blue-50 border border-blue-200 p-4 rounded-lg shadow-sm animate-fade-in">
        <p className="text-sm text-blue-900 leading-relaxed">
          <strong className="block mb-1 text-blue-950">Instruções de Uso:</strong>
          Utilize este formulário para registrar observações de Segurança, Saúde e Meio Ambiente com
          objetivo de corrigir ou melhorar condições de risco, alertar sobre comportamentos de risco
          ou reforçar comportamentos seguros. Situações relacionadas a Acidentes e Quase acidentes
          devem ser comunicadas diretamente à Supervisão ou Segurança do Trabalho.
        </p>
      </div>

      <Card className="shadow-elevation border-0 md:border">
        <CardHeader className="bg-slate-50 border-b pb-4 rounded-t-lg">
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-xl">Novo Relatório</CardTitle>
            <span className="text-sm text-slate-500 font-medium">
              Passo {step} de {TOTAL_STEPS}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>

        <CardContent className="pt-6 min-h-[400px]">
          {step === 1 && <Step1Identificador data={data} updateData={updateData} />}
          {step === 2 && <Step2Tipo data={data} updateData={updateData} />}
          {step === 3 && <Step3Detalhamento data={data} updateData={updateData} />}
          {step === 4 && <Step4Contexto data={data} updateData={updateData} />}
          {step === 5 && <Step5Avaliacao data={data} updateData={updateData} />}
        </CardContent>

        <CardFooter className="flex justify-between border-t bg-slate-50 p-4 rounded-b-lg">
          <Button variant="outline" onClick={handleBack} disabled={step === 1}>
            Voltar
          </Button>
          {step < TOTAL_STEPS ? (
            <Button onClick={handleNext} disabled={!isStepValid()} className="w-32">
              Avançar
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!isStepValid()}
              className="w-32 bg-amber-500 hover:bg-amber-600 text-white"
            >
              Registrar
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
