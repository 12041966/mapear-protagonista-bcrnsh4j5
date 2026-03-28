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
      .select('role, empresa_id, email')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      throw new Error('Profile not found')
    }

    const isSuperAdmin = profile.email === 'ferbatsan@hotmail.com'
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

    // Check if user already exists
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existingProfile) {
      return new Response(
        JSON.stringify({ error: 'O usuário já foi convidado ou cadastrado no sistema.' }),
        {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
          status: 400,
        },
      )
    }

    const nameToUse = name || email.split('@')[0]

    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: {
        name: nameToUse,
        role: role || 'Observador',
        empresa_id: targetEmpresaId,
        ...(whatsapp && { whatsapp }),
      },
      redirectTo: `https://www.mapear.net.br/cadastro?email=${encodeURIComponent(email)}&perfil=${encodeURIComponent(role || 'Observador')}`,
    })

    if (error) throw error

    return new Response(JSON.stringify({ success: true, user: data.user }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 200,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 400,
    })
  }
})
