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

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } },
    )

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()
    if (userError || !user) throw new Error('Unauthorized')

    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role, empresa_id, email')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) throw new Error('Profile not found')
    if (profile.role !== 'Administrador')
      throw new Error('Forbidden: Only administrators can invite users')

    const { email, name, role, empresa_id: requestedEmpresaId } = await req.json()
    if (!email) throw new Error('Email is required')

    const isSuperAdmin = profile.email === 'ferbatsan@hotmail.com'
    const targetEmpresaId =
      isSuperAdmin && requestedEmpresaId ? requestedEmpresaId : profile.empresa_id

    if (!targetEmpresaId) throw new Error('Forbidden: No company assigned')

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const nameToUse = name || email.split('@')[0]

    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: {
        name: nameToUse,
        role: role || 'Observador',
        empresa_id: targetEmpresaId,
      },
      redirectTo: `${req.headers.get('origin') || 'http://localhost:5173'}/login`,
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
