import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, x-supabase-client-platform, apikey, content-type',
}

// Helper to parse a single CSV line with basic quote handling
function parseCSVLine(line: string) {
  const result = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      if (i < line.length - 1 && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  result.push(current.trim())
  return result
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { csvData, empresaId } = await req.json()

    if (!csvData || !empresaId) {
      return new Response(JSON.stringify({ error: 'Dados insuficientes (csvData ou empresaId)' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const lines = csvData.split(/\r?\n/).filter((l: string) => l.trim().length > 0)
    if (lines.length < 2) {
      return new Response(JSON.stringify({ error: 'Arquivo CSV vazio ou sem registros' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase().replace(/[^a-z0-9_]/g, ''))
    const colMap: Record<string, number> = {}

    headers.forEach((h, i) => {
      if (h.includes('idfuncionario') || h.includes('matricula')) colMap.id_funcionario = i
      if (h.includes('nome')) colMap.nome = i
      if (h.includes('email')) colMap.email = i
      if (h.includes('whatsapp') || h.includes('telefone')) colMap.whatsapp = i
    })

    if (colMap.nome === undefined || colMap.email === undefined) {
      return new Response(
        JSON.stringify({
          error: 'O arquivo CSV deve conter pelo menos as colunas "nome" e "email"',
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const results = []

    for (let i = 1; i < lines.length; i++) {
      const cols = parseCSVLine(lines[i])

      const id_funcionario = colMap.id_funcionario !== undefined ? cols[colMap.id_funcionario] : ''
      const nome = cols[colMap.nome]
      const email = cols[colMap.email]
      const whatsapp = colMap.whatsapp !== undefined ? cols[colMap.whatsapp] : ''

      if (!nome || !email) {
        results.push({
          linha: i + 1,
          nome: nome || '-',
          email: email || '-',
          status: 'erro',
          motivo: 'Nome e email são obrigatórios',
        })
        continue
      }

      // Check for duplicate registration_number (Matrícula)
      if (id_funcionario) {
        const { data: existingReg } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('empresa_id', empresaId)
          .eq('registration_number', id_funcionario)
          .single()

        if (existingReg) {
          results.push({
            linha: i + 1,
            nome,
            email,
            status: 'erro',
            motivo: `Matrícula '${id_funcionario}' já está em uso na empresa`,
          })
          continue
        }
      }

      // Check for duplicate email
      const { data: existingEmail } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single()

      if (existingEmail) {
        results.push({
          linha: i + 1,
          nome,
          email,
          status: 'erro',
          motivo: `Email '${email}' já está cadastrado no sistema`,
        })
        continue
      }

      // Invite User securely via Supabase Auth Admin API
      const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        data: {
          name: nome,
          whatsapp: whatsapp || null,
          role: 'Observador',
          empresa_id: empresaId,
          registration_number: id_funcionario || null,
        },
      })

      if (inviteError) {
        results.push({
          linha: i + 1,
          nome,
          email,
          status: 'erro',
          motivo: inviteError.message,
        })
      } else {
        results.push({
          linha: i + 1,
          nome,
          email,
          status: 'sucesso',
          motivo: 'Colaborador convidado com sucesso',
        })
      }
    }

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
