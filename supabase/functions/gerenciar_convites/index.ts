import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, profile_id, token } = await req.json()

    if (!action) {
      return new Response(JSON.stringify({ success: false, error: 'Ação não informada' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    if (action === 'validar') {
      if (!token) throw new Error('Token não informado')

      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('status_convite, data_expiracao_convite')
        .eq('token_convite', token)
        .single()

      if (error || !data) throw new Error('Convite não encontrado ou inválido.')
      if (data.status_convite !== 'pendente')
        throw new Error('Este convite não está mais pendente ou já foi aceito.')
      if (data.data_expiracao_convite && new Date(data.data_expiracao_convite) < new Date()) {
        throw new Error('Este convite expirou.')
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200,
      })
    }

    if (action === 'revogar') {
      if (!profile_id) throw new Error('Profile ID não informado')

      const { error } = await supabaseAdmin
        .from('profiles')
        .update({ status_convite: 'revogado', token_convite: null })
        .eq('id', profile_id)

      if (error) throw error

      return new Response(
        JSON.stringify({ success: true, message: 'Convite revogado com sucesso.' }),
        {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
          status: 200,
        },
      )
    }

    if (action === 'reenviar') {
      if (!profile_id) throw new Error('Profile ID não informado')

      const { data: profile, error: profError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', profile_id)
        .single()

      if (profError || !profile) throw new Error('Perfil não encontrado.')

      const tokenConvite = crypto.randomUUID()
      const dataExpiracao = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
      const redirectTo = `https://mapear-protagonista.goskip.app/cadastro?email=${encodeURIComponent(profile.email)}&empresa_id=${profile.empresa_id}&nome=${encodeURIComponent(profile.name)}&perfil=${encodeURIComponent(profile.role)}&token=${tokenConvite}`

      let linkData, linkError

      const genRes = await supabaseAdmin.auth.admin.generateLink({
        type: 'invite',
        email: profile.email,
        options: {
          data: { name: profile.name, role: profile.role, empresa_id: profile.empresa_id },
          redirectTo,
        },
      })

      linkData = genRes.data
      linkError = genRes.error

      if (
        linkError &&
        (linkError.message.toLowerCase().includes('already registered') ||
          (linkError as any).status === 422 ||
          (linkError as any).code === 'user_already_exists')
      ) {
        const magicRes = await supabaseAdmin.auth.admin.generateLink({
          type: 'magiclink',
          email: profile.email,
          options: { redirectTo },
        })
        linkData = magicRes.data
        linkError = magicRes.error
      }

      if (linkError) throw linkError

      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({
          status_convite: 'pendente',
          token_convite: tokenConvite,
          data_envio_convite: new Date().toISOString(),
          data_expiracao_convite: dataExpiracao,
        })
        .eq('id', profile_id)

      if (updateError) throw updateError

      const { data: empresaData } = await supabaseAdmin
        .from('empresas')
        .select('nome')
        .eq('id', profile.empresa_id)
        .maybeSingle()

      await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-invite-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
        },
        body: JSON.stringify({
          email: profile.email,
          nome_usuario: profile.name,
          link_convite: linkData.properties.action_link,
          empresa_nome: empresaData?.nome || '',
        }),
      })

      return new Response(
        JSON.stringify({ success: true, message: 'Convite reenviado com sucesso.' }),
        {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
          status: 200,
        },
      )
    }

    return new Response(JSON.stringify({ success: false, error: 'Ação inválida' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 200,
    })
  }
})
