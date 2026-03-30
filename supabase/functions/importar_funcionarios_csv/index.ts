import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2.39.3'

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
        status: 200,
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
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase().replace(/[^a-z0-9_]/g, ''))
    const colMap: Record<string, number> = {}

    headers.forEach((h, i) => {
      if (h.includes('email')) colMap.email = i
      if (h.includes('perfil') || h.includes('role')) colMap.perfil = i
      if (h.includes('empresaid') || h.includes('empresa_id')) colMap.empresa_id = i
      if (h.includes('idfuncionario') || h.includes('id_funcionario') || h.includes('registro'))
        colMap.id_funcionario = i
    })

    if (colMap.email === undefined) {
      return new Response(
        JSON.stringify({ error: 'O arquivo CSV deve conter pelo menos a coluna "email"' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const results = []
    const roleMap: Record<string, string> = {
      admin: 'Administrador',
      administrador: 'Administrador',
      user: 'Supervisor',
      usuario: 'Supervisor',
      usuário: 'Supervisor',
      viewer: 'Observador',
      observador: 'Observador',
    }

    for (let i = 1; i < lines.length; i++) {
      const cols = parseCSVLine(lines[i])
      if (cols.length === 1 && cols[0] === '') continue

      const email = cols[colMap.email]?.trim()
      const rawPerfil = colMap.perfil !== undefined ? cols[colMap.perfil]?.trim() : 'Observador'
      const rowEmpresaId =
        colMap.empresa_id !== undefined && cols[colMap.empresa_id]?.trim() !== ''
          ? cols[colMap.empresa_id]?.trim()
          : empresaId
      const rawIdFuncionario =
        colMap.id_funcionario !== undefined ? cols[colMap.id_funcionario]?.trim() : ''
      const idFuncionario = rawIdFuncionario ? parseInt(rawIdFuncionario, 10) : null
      const nome = email ? email.split('@')[0] : '-'
      const mappedRole = roleMap[rawPerfil.toLowerCase()] || 'Observador'

      if (!email) {
        results.push({
          linha: i + 1,
          nome: '-',
          email: '-',
          status: 'erro',
          motivo: 'Email é obrigatório',
        })
        continue
      }

      // Check for duplicate email in THIS company
      const { data: existingEmail } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('email', email)
        .eq('empresa_id', rowEmpresaId)
        .maybeSingle()

      if (existingEmail) {
        results.push({
          linha: i + 1,
          nome,
          email,
          status: 'erro',
          motivo: `O usuário já está cadastrado nesta empresa.`,
        })
        continue
      }

      // Generate Invite Link securely via Supabase Auth Admin API
      const { data: linkData, error: inviteError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'invite',
        email: email,
        options: {
          data: {
            name: nome,
            role: mappedRole,
            empresa_id: rowEmpresaId,
            id_funcionario: idFuncionario,
          },
          redirectTo: `https://mapear-protagonista.goskip.app/cadastro?email=${encodeURIComponent(email)}&empresa_id=${rowEmpresaId}&nome=${encodeURIComponent(nome)}&perfil=${encodeURIComponent(mappedRole)}`,
        },
      })

      if (inviteError) {
        if (
          inviteError.message.toLowerCase().includes('already registered') ||
          (inviteError as any).status === 422 ||
          (inviteError as any).code === 'user_already_exists'
        ) {
          // User exists in Auth, insert secondary profile
          const { error: insertError } = await supabaseAdmin.from('profiles').insert({
            id: crypto.randomUUID(),
            email,
            name: nome,
            role: mappedRole,
            empresa_id: rowEmpresaId,
            id_funcionario: idFuncionario,
            status: 'pendente_confirmacao',
          })

          if (insertError) {
            results.push({
              linha: i + 1,
              nome,
              email,
              status: 'erro',
              motivo: insertError.message,
            })
          } else {
            results.push({
              linha: i + 1,
              nome,
              email,
              status: 'sucesso',
              motivo: 'Vínculo adicionado (usuário já possuía conta).',
            })
          }
        } else {
          results.push({
            linha: i + 1,
            nome,
            email,
            status: 'erro',
            motivo: inviteError.message,
          })
        }
      } else {
        const { data: empresaData } = await supabaseAdmin
          .from('empresas')
          .select('nome')
          .eq('id', rowEmpresaId)
          .maybeSingle()

        await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-invite-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
          },
          body: JSON.stringify({
            email: email,
            nome_usuario: nome,
            link_convite: linkData.properties.action_link,
            empresa_nome: empresaData?.nome || '',
          }),
        }).catch((err) => console.error('Erro ao chamar send-invite-email na importação:', err))

        results.push({
          linha: i + 1,
          nome,
          email,
          status: 'sucesso',
          motivo: 'Colaborador convidado com sucesso.',
        })
      }
    }

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
