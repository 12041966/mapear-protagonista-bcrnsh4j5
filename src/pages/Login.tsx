import { useState, useEffect } from 'react'
import { useNavigate, Navigate, useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { ShieldCheck } from 'lucide-react'

export default function Login() {
  const [searchParams] = useSearchParams()
  const [isRegistering, setIsRegistering] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [regName, setRegName] = useState('')
  const [regWhatsapp, setRegWhatsapp] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regCompanyCode, setRegCompanyCode] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirmPassword, setRegConfirmPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const { signIn, signUp, user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [resetOpen, setResetOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetting, setResetting] = useState(false)

  useEffect(() => {
    const code = searchParams.get('code') || searchParams.get('companyCode')
    if (code) {
      setRegCompanyCode(code)
      setIsRegistering(true)
    }
  }, [searchParams])

  if (user) {
    return <Navigate to="/" replace />
  }

  const formatPhone = (val: string) => {
    const cleaned = val.replace(/\D/g, '')
    let formatted = cleaned
    if (cleaned.length > 2) {
      formatted = `(${cleaned.slice(0, 2)}) ` + cleaned.slice(2)
    }
    if (cleaned.length > 7) {
      formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`
    }
    return formatted
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao entrar',
        description: error.message.includes('Invalid login')
          ? 'Credenciais inválidas.'
          : 'Ocorreu um erro ao tentar entrar. Verifique seus dados.',
      })
    } else {
      navigate('/')
    }
    setLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (regPassword !== regConfirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Senhas não coincidem',
        description: 'A senha e a confirmação de senha devem ser iguais.',
      })
      return
    }

    setLoading(true)
    const { error } = await signUp(regEmail, regPassword, {
      data: {
        name: regName,
        whatsapp: regWhatsapp,
        empresa_id: regCompanyCode,
      },
    })

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao cadastrar',
        description: error.message.includes('uuid')
          ? 'Código da empresa inválido. Verifique o identificador.'
          : error.message,
      })
    } else {
      toast({
        title: 'Cadastro realizado com sucesso!',
        description: 'Faça login com as credenciais que você acabou de criar.',
      })
      setEmail(regEmail)
      setRegPassword('')
      setRegConfirmPassword('')
      setIsRegistering(false)
    }
    setLoading(false)
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resetEmail) return
    setResetting(true)
    try {
      const response = await fetch(
        'https://tozkabqyfrcqunzzarkv.supabase.co/functions/v1/request-password-reset',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: resetEmail }),
        },
      )
      if (response.ok) {
        toast({
          title: 'Email enviado',
          description: 'Se o email estiver cadastrado, você receberá instruções de recuperação.',
        })
        setResetOpen(false)
      } else {
        throw new Error('Falha ao solicitar recuperação')
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível solicitar a recuperação de senha.',
      })
    }
    setResetting(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 py-12">
      <Card className="w-full max-w-md shadow-lg border-0 md:border transition-all duration-300">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="mx-auto w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-2">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            {isRegistering ? 'Criar Conta' : 'MAPEAR Protagonista'}
          </CardTitle>
          <CardDescription>
            {isRegistering
              ? 'Preencha seus dados para se cadastrar na plataforma.'
              : 'Entre com suas credenciais para acessar a plataforma.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isRegistering ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="regName">Nome</Label>
                <Input
                  id="regName"
                  type="text"
                  placeholder="Seu nome completo"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="regWhatsapp">WhatsApp</Label>
                <Input
                  id="regWhatsapp"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={regWhatsapp}
                  onChange={(e) => setRegWhatsapp(formatPhone(e.target.value))}
                  required
                  maxLength={15}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="regEmail">E-mail</Label>
                <Input
                  id="regEmail"
                  type="email"
                  placeholder="nome@empresa.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="regCompanyCode">Código da Empresa</Label>
                <Input
                  id="regCompanyCode"
                  type="text"
                  placeholder="Identificador da empresa"
                  value={regCompanyCode}
                  onChange={(e) => setRegCompanyCode(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="regPassword">Senha</Label>
                  <Input
                    id="regPassword"
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regConfirmPassword">Confirmação</Label>
                  <Input
                    id="regConfirmPassword"
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </Button>
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setIsRegistering(false)}
                  className="text-sm text-primary hover:underline"
                >
                  Já tem uma conta? Entre
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nome@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <button
                    type="button"
                    onClick={() => setResetOpen(true)}
                    className="text-sm text-primary hover:underline"
                  >
                    Esqueci minha senha
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setIsRegistering(true)}
                  className="text-sm text-primary hover:underline"
                >
                  Não tem uma conta? Cadastre-se
                </button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Recuperação de Senha</DialogTitle>
            <DialogDescription>
              Informe o email associado à sua conta para receber as instruções.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleResetPassword} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="resetEmail">Email</Label>
              <Input
                id="resetEmail"
                type="email"
                placeholder="nome@empresa.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setResetOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={resetting || !resetEmail}>
                {resetting ? 'Enviando...' : 'Enviar Instruções'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
