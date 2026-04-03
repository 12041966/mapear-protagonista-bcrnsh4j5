import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, x-supabase-client-platform, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing Authorization header')
    }
    const token = authHeader.replace('Bearer ', '')

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } },
    )

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser(token)
    if (userError || !user) {
      throw new Error('Unauthorized: ' + (userError?.message || 'User not found'))
    }

    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role, empresa_id, email, is_super_admin')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      throw new Error('Profile not found')
    }

    const isSuperAdmin = profile.is_super_admin === true
    if (profile.role !== 'Administrador' && !isSuperAdmin) {
      throw new Error('Forbidden: Only administrators can invite users')
    }

    const { email, name, role, whatsapp, empresa_id: requestedEmpresaId } = await req.json()
    if (!email) throw new Error('Email is required')

    const targetEmpresaId =
      isSuperAdmin && requestedEmpresaId ? requestedEmpresaId : profile.empresa_id

    if (!targetEmpresaId) {
      throw new Error('Forbidden: No company assigned')
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Verificar se o usuário já existe nesta empresa
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id, status_convite')
      .eq('email', email)
      .eq('empresa_id', targetEmpresaId)
      .maybeSingle()

    if (existingProfile) {
      if (existingProfile.status_convite === 'pendente') {
        return new Response(
          JSON.stringify({
            error: 'Já existe um convite pendente para este usuário nesta empresa.',
          }),
          {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
            status: 200,
          },
        )
      }
      return new Response(
        JSON.stringify({ error: 'O usuário já está cadastrado nesta empresa.' }),
        {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
          status: 200,
        },
      )
    }

    const nameToUse = name || email.split('@')[0]
    const tokenConvite = crypto.randomUUID()
    const dataExpiracao = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()

    const { data: empresaData } = await supabaseAdmin
      .from('empresas')
      .select('nome, codigo_empresa')
      .eq('id', targetEmpresaId)
      .maybeSingle()

    const codigoEmpresa = empresaData?.codigo_empresa || ''

    // Insere diretamente o perfil com o token
    const profileId = crypto.randomUUID()
    const { error: insertError } = await supabaseAdmin.from('profiles').insert({
      id: profileId,
      email,
      name: nameToUse,
      role: role || 'Observador',
      empresa_id: targetEmpresaId,
      whatsapp,
      status: 'pendente_confirmacao',
      status_convite: 'pendente',
      token_convite: tokenConvite,
      data_envio_convite: new Date().toISOString(),
      data_expiracao_convite: dataExpiracao,
      active: true,
    })

    if (insertError) throw insertError

    const linkConvite = `https://mapear-protagonista.goskip.app/cadastro?email=${encodeURIComponent(email)}&empresa_id=${targetEmpresaId}&codigo_empresa=${codigoEmpresa}&nome=${encodeURIComponent(nameToUse)}&perfil=${encodeURIComponent(role || 'Observador')}&token=${tokenConvite}`

    await supabaseAdmin.functions
      .invoke('send-invite-email', {
        body: {
          email: email,
          nome_usuario: nameToUse,
          link_convite: linkConvite,
          empresa_nome: empresaData?.nome || '',
        },
      })
      .catch((err) => console.error('Erro ao chamar send-invite-email:', err))

    return new Response(
      JSON.stringify({ success: true, message: 'Convite enviado com sucesso.' }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200,
      },
    )
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 200,
    })
  }
})
