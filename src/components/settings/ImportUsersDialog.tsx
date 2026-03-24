import { useState, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { Loader2, Download, Upload, FileText, CheckCircle2, XCircle } from 'lucide-react'

interface ImportResult {
  linha: number
  nome: string
  email: string
  status: 'sucesso' | 'erro'
  motivo: string
}

interface ImportUsersDialogProps {
  isOpen: boolean
  onClose: () => void
  targetCompanyId: string
  onSuccess: () => void
}

export function ImportUsersDialog({
  isOpen,
  onClose,
  targetCompanyId,
  onSuccess,
}: ImportUsersDialogProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [results, setResults] = useState<ImportResult[]>([])

  const handleDownloadTemplate = () => {
    const template =
      'id_funcionario,nome,email,whatsapp\n1234,João da Silva,joao@empresa.com.br,11999999999\n'
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'modelo_importacao_colaboradores.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
      setResults([])
    }
  }

  const handleProcessImport = () => {
    if (!file || !targetCompanyId) return

    setImporting(true)
    setResults([])

    const reader = new FileReader()
    reader.onload = async (e) => {
      const text = e.target?.result
      if (typeof text === 'string') {
        try {
          const { data, error } = await supabase.functions.invoke('importar_funcionarios_csv', {
            body: { csvData: text, empresaId: targetCompanyId },
          })

          if (error) throw error
          if (data?.error) throw new Error(data.error)

          setResults(data.results || [])
          toast({
            title: 'Importação Concluída',
            description: 'Verifique o relatório para mais detalhes.',
          })
          onSuccess()
        } catch (err: any) {
          toast({
            variant: 'destructive',
            title: 'Erro na importação',
            description: err.message || 'Ocorreu um erro ao processar o arquivo.',
          })
        } finally {
          setImporting(false)
        }
      }
    }
    reader.onerror = () => {
      setImporting(false)
      toast({ variant: 'destructive', title: 'Erro', description: 'Falha ao ler o arquivo.' })
    }
    reader.readAsText(file)
  }

  const handleClose = () => {
    if (importing) return
    setFile(null)
    setResults([])
    if (fileInputRef.current) fileInputRef.current.value = ''
    onClose()
  }

  const successes = results.filter((r) => r.status === 'sucesso').length
  const errors = results.filter((r) => r.status === 'erro').length

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Importação em Massa (CSV)</DialogTitle>
          <DialogDescription>
            Envie uma planilha CSV para convidar múltiplos colaboradores de uma vez.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!results.length ? (
            <>
              <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Arquivo Modelo</p>
                    <p className="text-xs text-slate-500">
                      Baixe o modelo com as colunas corretas.
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
                  <Download className="w-4 h-4 mr-2" /> Baixar Modelo
                </Button>
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Button
                  variant="outline"
                  className="w-full h-24 border-dashed border-2 flex flex-col gap-2"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={importing}
                >
                  <Upload className="w-6 h-6 text-slate-400" />
                  <span className="text-sm text-slate-600">
                    {file ? file.name : 'Clique para selecionar o arquivo .CSV'}
                  </span>
                </Button>
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-4 p-4 rounded-lg border bg-slate-50">
                <div className="flex-1">
                  <p className="text-sm text-slate-500">Total Processado</p>
                  <p className="text-2xl font-bold">{results.length}</p>
                </div>
                <div className="flex-1 text-emerald-600">
                  <p className="text-sm font-medium">Sucesso</p>
                  <p className="text-2xl font-bold">{successes}</p>
                </div>
                <div className="flex-1 text-red-600">
                  <p className="text-sm font-medium">Erros</p>
                  <p className="text-2xl font-bold">{errors}</p>
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto border rounded-lg divide-y text-sm">
                {results.map((r, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-white">
                    {r.status === 'sucesso' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    )}
                    <div>
                      <p className="font-medium text-slate-900">
                        Linha {r.linha}: {r.nome}
                      </p>
                      <p className="text-slate-500">{r.motivo}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={handleClose} disabled={importing}>
            {results.length ? 'Fechar' : 'Cancelar'}
          </Button>
          {!results.length && (
            <Button onClick={handleProcessImport} disabled={!file || importing}>
              {importing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processando...
                </>
              ) : (
                'Iniciar Importação'
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
