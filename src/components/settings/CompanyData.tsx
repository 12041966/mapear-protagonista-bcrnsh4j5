import { useState, useEffect } from 'react'
import { useMainStore } from '@/stores/main'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Download, Building2, AlertTriangle, Loader2 } from 'lucide-react'

export function CompanyData() {
  const { currentUser, isSuperAdmin, activeCompanyId } = useMainStore()
  const { toast } = useToast()
  const [empresa, setEmpresa] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const targetCompanyId =
    isSuperAdmin && activeCompanyId !== 'all' ? activeCompanyId : currentUser?.companyId

  useEffect(() => {
    async function fetchEmpresa() {
      if (!targetCompanyId) {
        setLoading(false)
        return
      }
      setLoading(true)
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .eq('id', targetCompanyId)
        .single()

      if (data) setEmpresa(data)
      setLoading(false)
    }
    fetchEmpresa()
  }, [targetCompanyId])

  if (isSuperAdmin && activeCompanyId === 'all') {
    return (
      <div className="bg-white border rounded-lg p-8 text-center shadow-sm animate-fade-in-up">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Selecione uma Empresa</h2>
        <p className="text-slate-600 max-w-md mx-auto">
          Para visualizar os dados e o QR Code de cadastro, selecione uma empresa específica no
          seletor do topo da página.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-500">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Carregando dados da empresa...
      </div>
    )
  }

  if (!empresa) {
    return (
      <div className="bg-white border rounded-lg p-8 text-center shadow-sm">
        <p className="text-slate-500">Empresa não encontrada.</p>
      </div>
    )
  }

  const link = `${window.location.origin}/login?companyCode=${empresa.codigo_empresa}`
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(link)}`

  const handleCopyCode = () => {
    navigator.clipboard.writeText(empresa.codigo_empresa)
    toast({ title: 'Código copiado!', description: 'O código da empresa foi copiado.' })
  }

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
    <div className="grid md:grid-cols-2 gap-6 items-start animate-fade-in-up">
      <Card>
        <CardHeader>
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <CardTitle>Informações de Cadastro</CardTitle>
          <CardDescription>Dados para identificação da empresa no sistema.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-500">Nome da Empresa</p>
            <p className="text-lg font-semibold text-slate-900">{empresa.nome}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-500">Código no Sistema</p>
            <div className="flex items-center gap-2">
              <code className="bg-slate-100 px-3 py-1.5 rounded text-sm text-slate-700 font-mono font-semibold">
                {empresa.codigo_empresa}
              </code>
              <Button variant="ghost" size="sm" onClick={handleCopyCode} className="h-8">
                <Copy className="w-4 h-4 mr-2" /> Copiar Código
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Este código deve ser informado pelos colaboradores no momento do cadastro manual.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>QR Code de Compartilhamento</CardTitle>
          <CardDescription>
            Compartilhe este QR Code ou link para facilitar o cadastro dos seus colaboradores.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="bg-white p-4 rounded-xl shadow-sm border mb-6">
            <img src={qrUrl} alt={`QR Code para ${empresa.nome}`} className="w-48 h-48 mx-auto" />
          </div>
          <div className="w-full flex flex-col gap-3">
            <Button onClick={handleCopyLink} variant="outline" className="w-full">
              <Copy className="w-4 h-4 mr-2" /> Copiar Link de Cadastro
            </Button>
            <Button onClick={handleDownload} className="w-full">
              <Download className="w-4 h-4 mr-2" /> Baixar QR Code
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
