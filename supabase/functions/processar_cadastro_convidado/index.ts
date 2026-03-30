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
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { email, password, nome, whatsapp, empresa_id, perfil, token } = await req.json()

    if (!email || !password || !nome) {
      return new Response(JSON.stringify({ error: 'Dados incompletos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    let profileId = null

    // 1. Validar token se existir
    if (token) {
      const { data: convite, error: conviteError } = await supabaseAdmin
        .from('profiles')
        .select('id, status_convite, data_expiracao_convite, email')
        .eq('token_convite', token)
        .single()

      if (conviteError || !convite) {
        return new Response(
          JSON.stringify({
            error: 'Convite expirado ou inválido. Solicite um novo convite ao administrador',
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          },
        )
      }

      if (convite.status_convite !== 'pendente') {
        return new Response(
          JSON.stringify({ error: 'Este convite já foi utilizado ou revogado' }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          },
        )
      }

      if (convite.data_expiracao_convite && new Date(convite.data_expiracao_convite) < new Date()) {
        return new Response(
          JSON.stringify({
            error: 'Convite expirado ou inválido. Solicite um novo convite ao administrador',
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          },
        )
      }

      profileId = convite.id
    }

    // 2. Criar ou atualizar Auth User
    let authUser = null

    const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    if (listError) throw listError

    const existingAuthUser = existingUsers.users.find((u) => u.email === email)

    if (existingAuthUser) {
      authUser = existingAuthUser
      const { error: updateAuthError } = await supabaseAdmin.auth.admin.updateUserById(
        authUser.id,
        {
          password: password,
          email_confirm: true,
          user_metadata: { name: nome, whatsapp, empresa_id, role: perfil || 'Observador' },
        },
      )
      if (updateAuthError) throw updateAuthError
    } else {
      const { data: newAuthData, error: createAuthError } =
        await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { name: nome, whatsapp, empresa_id, role: perfil || 'Observador' },
        })
      if (createAuthError) throw createAuthError
      authUser = newAuthData.user
    }

    // 3. Atualizar Profile
    const profileUpdates: any = {
      name: nome,
      whatsapp: whatsapp || null,
      empresa_id: empresa_id || null,
      role: perfil || 'Observador',
      status: 'ativo',
      active: true,
    }

    if (token) {
      profileUpdates.status_convite = 'aceito'
      profileUpdates.token_convite = null
    }

    if (profileId) {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update(profileUpdates)
        .eq('id', profileId)

      if (profileError) throw profileError
    } else {
      const { error: profileUpdateError } = await supabaseAdmin
        .from('profiles')
        .update(profileUpdates)
        .eq('id', authUser.id)

      if (profileUpdateError) {
        const { error: insertProfileError } = await supabaseAdmin.from('profiles').insert({
          id: authUser.id,
          email,
          ...profileUpdates,
        })
        if (insertProfileError && insertProfileError.code !== '23505') {
          throw insertProfileError
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Cadastro realizado com sucesso' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      },
    )
  } catch (error: any) {
    console.error('Erro no processar_cadastro_convidado:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Erro interno ao processar o cadastro' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      },
    )
  }
})
