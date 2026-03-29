import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { observacao_id, status_anterior, status_novo, justificativa, responsavel_nome } = await req.json()

    if (!observacao_id || !status_novo) {
      return new Response(JSON.stringify({ error: 'Parâmetros insuficientes' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(observacao_id);
    let query = supabaseAdmin
      .from('observacoes')
      .select(`
        id,
        codigo,
        status,
        user_id,
        profiles(name, email)
      `);
      
    if (isUuid) {
      query = query.eq('id', observacao_id);
    } else {
      query = query.eq('codigo', observacao_id);
    }

    const { data: obs, error: obsError } = await query.single()

    if (obsError || !obs) {
      throw new Error('Observação não encontrada')
    }

    // Usando Array(obs.profiles) ou objeto direto dependendo do retorno (foreign key única retorna objeto único no Supabase)
    const profile = Array.isArray(obs.profiles) ? obs.profiles[0] : obs.profiles;
    const observerEmail = profile?.email
    const observerName = profile?.name || 'Observador'

    if (!observerEmail) {
      return new Response(JSON.stringify({ success: false, message: 'Observador sem email cadastrado' }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200,
      })
    }

    const dataHora = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">Atualização na Observação ${obs.codigo}</h2>
        <p>Olá <strong>${observerName}</strong>,</p>
        <p>O status do seu relato foi alterado. Confira os detalhes abaixo:</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <ul style="list-style-type: none; padding: 0; margin: 0;">
            <li style="margin-bottom: 10px;"><strong>Status Anterior:</strong> <span style="color: #666;">${status_anterior || '-'}</span></li>
            <li style="margin-bottom: 10px;"><strong>Novo Status:</strong> <span style="color: #059669; font-weight: bold;">${status_novo}</span></li>
            ${justificativa ? `<li style="margin-bottom: 10px;"><strong>Justificativa:</strong> ${justificativa}</li>` : ''}
            <li style="margin-bottom: 10px;"><strong>Responsável:</strong> ${responsavel_nome || '-'}</li>
            <li><strong>Data/Hora:</strong> ${dataHora}</li>
          </ul>
        </div>
        <p style="margin-top: 20px;">
          <a href="https://www.mapear.net.br/" style="color: #2563eb; text-decoration: none; font-weight: bold;">
            Acesse o sistema
          </a> para visualizar mais detalhes.
        </p>
        <p style="font-size: 12px; color: #999; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
          Esta é uma mensagem automática, por favor não responda.
        </p>
      </div>
    `

    console.log(`[EMAIL SIMULADO] Para: ${observerEmail} | Assunto: Atualização na Observação ${obs.codigo}`)

    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (resendApiKey) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`
        },
        body: JSON.stringify({
          from: 'Cultura de Segurança <nao-responda@resend.dev>', 
          to: observerEmail,
          subject: `Atualização na Observação ${obs.codigo}`,
          html: emailHtml
        })
      });
      if (!res.ok) {
         const errData = await res.text();
         console.error('Erro ao enviar email pelo Resend:', errData);
      }
    }

    return new Response(JSON.stringify({ success: true, message: 'Notificação processada com sucesso' }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 200,
    })

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  }
})
