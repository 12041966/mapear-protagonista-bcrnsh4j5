import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function Cadastro() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const emailParam = searchParams.get('email') || ''
  const empresaIdParam = searchParams.get('empresa_id') || ''
  const nomeParam = searchParams.get('nome') || ''
  const tokenParam = searchParams.get('token') || ''

  const perfilParam = searchParams.get('perfil') || 'Observador'

  const [empresaNome, setEmpresaNome] = useState('')
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [tokenError, setTokenError] = useState('')

  const [nome, setNome] = useState(nomeParam)
  const [email, setEmail] = useState(emailParam)
  const [whatsapp, setWhatsapp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    const init = async () => {
      if (tokenParam) {
        const { data, error } = await supabase.functions.invoke('gerenciar_convites', {
          body: { action: 'validar', token: tokenParam },
        })
        if (error || !data?.success) {
          setTokenError('Convite expirado ou inválido. Solicite um novo convite ao administrador.')
          setInitialLoading(false)
          return
        }
      }

      if (empresaIdParam) {
        const { data } = await supabase
          .from('empresas')
          .select('nome, codigo_empresa')
          .eq('id', empresaIdParam)
          .single()
        if (data) {
          setEmpresaNome(`${data.codigo_empresa} - ${data.nome}`)
        }
      }
      setInitialLoading(false)
    }
    init()
  }, [empresaIdParam, tokenParam])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!password || !confirmPassword) {
      toast({
        title: 'Erro',
        description: 'Preencha a senha e a confirmação.',
        variant: 'destructive',
      })
      return
    }

    if (password !== confirmPassword) {
      toast({ title: 'Erro', description: 'As senhas não coincidem.', variant: 'destructive' })
      return
    }

    if (password.length < 6) {
      toast({
        title: 'Erro',
        description: 'A senha deve ter pelo menos 6 caracteres.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      let currentUserId = session?.user?.id

      if (session?.user) {
        const { error: updateAuthError } = await supabase.auth.updateUser({
          password: password,
        })
        if (updateAuthError) throw updateAuthError
      } else {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: nome,
              empresa_id: empresaIdParam,
              whatsapp,
              role: perfilParam,
            },
          },
        })
        if (signUpError) {
          if (
            signUpError.message.toLowerCase().includes('already registered') ||
            signUpError.status === 422
          ) {
            throw new Error('Este e-mail já está cadastrado no sistema. Faça login.')
          }
          throw signUpError
        }
        currentUserId = signUpData.user?.id
      }

      if (currentUserId) {
        const updates: any = {
          whatsapp: whatsapp,
          status: 'ativo',
          active: true,
          name: nome,
        }

        if (tokenParam) {
          updates.status_convite = 'aceito'
          updates.token_convite = null
        }

        const { error: profileError } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', currentUserId)

        if (profileError) {
          console.error('Erro ao atualizar perfil:', profileError)
        }
      }

      toast({
        title: 'Cadastro concluído!',
        description: 'Sua conta foi ativada com sucesso. Faça login para acessar a plataforma.',
      })

      await supabase.auth.signOut()
      navigate('/login')
    } catch (error: any) {
      console.error(error)
      toast({
        title: 'Erro ao concluir cadastro',
        description: error.message || 'Ocorreu um erro ao processar seu cadastro.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (tokenError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-lg shadow-lg border-0">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-slate-800 text-destructive">
              Convite Inválido
            </CardTitle>
            <CardDescription className="text-slate-500 mt-2">{tokenError}</CardDescription>
          </CardHeader>
          <CardFooter className="pt-6">
            <Button onClick={() => navigate('/login')} className="w-full">
              Voltar para o Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-lg shadow-lg border-0">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">Finalizar Cadastro</CardTitle>
          <CardDescription className="text-slate-500">
            Complete suas informações para ativar sua conta na plataforma.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Código / Empresa</Label>
              <Input
                value={empresaNome || empresaIdParam || 'Carregando...'}
                disabled
                className="bg-slate-100 font-medium text-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                disabled={!!tokenParam}
                className={tokenParam ? 'bg-slate-100 text-slate-600' : ''}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!!tokenParam}
                className={tokenParam ? 'bg-slate-100 text-slate-600' : ''}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>WhatsApp</Label>
              <Input
                placeholder="(00) 00000-0000"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Crie sua Senha</Label>
              <Input
                type="password"
                placeholder="No mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Confirmar Senha</Label>
              <Input
                type="password"
                placeholder="Repita a senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Cadastrar
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
