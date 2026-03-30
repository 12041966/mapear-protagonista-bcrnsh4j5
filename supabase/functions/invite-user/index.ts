import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, x-supabase-client-platform, apikey, content-type',
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
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)
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

    const targetEmpresaId = isSuperAdmin && requestedEmpresaId ? requestedEmpresaId : profile.empresa_id

    if (!targetEmpresaId) {
      throw new Error('Forbidden: No company assigned')
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check if user already exists
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', email)
      .eq('empresa_id', targetEmpresaId)
      .maybeSingle()

    if (existingProfile) {
      return new Response(JSON.stringify({ error: 'O usuário já foi convidado ou cadastrado no sistema nesta empresa.' }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200,
      })
    }

    const nameToUse = name || email.split('@')[0]

    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'invite',
      email: email,
      options: {
        data: {
          name: nameToUse,
          role: role || 'Observador',
          empresa_id: targetEmpresaId,
          ...(whatsapp && { whatsapp })
        },
        redirectTo: `https://mapear-protagonista.goskip.app/cadastro?email=${encodeURIComponent(email)}&empresa_id=${targetEmpresaId}&nome=${encodeURIComponent(nameToUse)}&perfil=${encodeURIComponent(role || 'Observador')}`      }
    })

    if (linkError) {
      if (
        linkError.message.toLowerCase().includes('already registered') ||
        (linkError as any).status === 422 ||
        (linkError as any).code === 'user_already_exists'
      ) {
        // User exists in auth.users, create secondary profile
        const { error: insertError } = await supabaseAdmin.from('profiles').insert({
          id: crypto.randomUUID(),
          email,
          name: nameToUse,
          role: role || 'Observador',
          empresa_id: targetEmpresaId,
          whatsapp,
          status: 'pendente_confirmacao'
        });

        if (insertError) throw insertError;
        
        return new Response(JSON.stringify({ success: true, message: 'Vínculo adicionado com sucesso (o usuário já possuía conta no sistema).' }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
          status: 200,
        })
      }
      throw linkError;
    }

    const { data: empresaData } = await supabaseAdmin
      .from('empresas')
      .select('nome')
      .eq('id', targetEmpresaId)
      .maybeSingle();

    await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-invite-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
      },
      body: JSON.stringify({
        email: email,
        nome_usuario: nameToUse,
        link_convite: linkData.properties.action_link,
        empresa_nome: empresaData?.nome || ''
      })
    }).catch(err => console.error('Erro ao chamar send-invite-email:', err));

    return new Response(JSON.stringify({ success: true, user: linkData.user }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 200,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 200,
    })
  }
})
