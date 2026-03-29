import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { empresa_id, preview } = await req.json()

    if (!empresa_id) {
      return new Response(JSON.stringify({ error: 'O parâmetro empresa_id é obrigatório.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    const currentYear = new Date().getFullYear()
    const sequenceType = `observacao_${currentYear}`

    let nextNum = 1

    if (preview) {
      // Apenas consulta o próximo número sem incrementar (para cache/pré-visualização no frontend)
      const { data, error: seqError } = await supabaseAdmin
        .from('sequencias')
        .select('proximo_numero')
        .eq('empresa_id', empresa_id)
        .eq('tipo_sequencia', sequenceType)
        .maybeSingle()

      if (seqError) {
        console.error('Erro ao consultar prévia da sequência:', seqError)
      } else if (data) {
        nextNum = data.proximo_numero
      }
    } else {
      // A função RPC 'get_next_sequence_value' usa transações atômicas nativas do PostgreSQL
      // (INSERT ... ON CONFLICT DO UPDATE) garantindo concorrência sem bloqueios (locks).
      const { data: rpcData, error: rpcError } = await supabaseAdmin.rpc('get_next_sequence_value', {
        p_empresa_id: empresa_id,
        p_tipo: sequenceType,
      })

      if (rpcError) {
        throw rpcError
      }
      nextNum = rpcData
    }

    // Formata o código com 4 dígitos (ex: OBS-2026-0001)
    const codigo = `OBS-${currentYear}-${String(nextNum).padStart(4, '0')}`

    return new Response(JSON.stringify({ codigo }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 200,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 500,
    })
  }
})
