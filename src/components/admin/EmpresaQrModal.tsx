import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Copy, Download } from 'lucide-react'
import { Tables } from '@/lib/supabase/types'

type Empresa = Tables<'empresas'>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  empresa: Empresa | null
}

export function EmpresaQrModal({ open, onOpenChange, empresa }: Props) {
  const { toast } = useToast()

  if (!empresa) return null

  const link = `${window.location.origin}/login?companyCode=${empresa.codigo_empresa}`
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(link)}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(link)
    toast({
      title: 'Link copiado!',
      description: 'O link de cadastro foi copiado para a área de transferência.',
    })
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(qrUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `qrcode-${empresa.codigo_empresa}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível baixar o QR Code.',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm text-center">
        <DialogHeader>
          <DialogTitle className="text-center">QR Code de Cadastro</DialogTitle>
          <DialogDescription className="text-center">
            Compartilhe este QR Code para facilitar o cadastro de colaboradores na empresa{' '}
            <strong>{empresa.nome}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-6 space-y-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <img src={qrUrl} alt={`QR Code para ${empresa.nome}`} className="w-48 h-48 mx-auto" />
          </div>
          <code className="bg-slate-100 px-3 py-1 rounded text-sm text-slate-600 font-mono font-semibold">
            {empresa.codigo_empresa}
          </code>
        </div>

        <div className="flex flex-col gap-3">
          <Button onClick={handleCopyLink} variant="outline" className="w-full">
            <Copy className="w-4 h-4 mr-2" />
            Copiar Link
          </Button>
          <Button onClick={handleDownload} className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Baixar QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
