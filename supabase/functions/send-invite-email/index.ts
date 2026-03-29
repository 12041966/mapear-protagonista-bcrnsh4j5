import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import nodemailer from 'npm:nodemailer@6.9.13'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload = await req.json()
    const { email, nome_usuario, link_convite, empresa_nome } = payload

    if (!email || !link_convite) {
      return new Response(JSON.stringify({ error: 'Parâmetros insuficientes: email e link_convite são obrigatórios.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    const smtpHost = Deno.env.get('SMTP_HOST')
    const smtpPort = Deno.env.get('SMTP_PORT') || '465'
    const smtpUser = Deno.env.get('SMTP_USER')
    const smtpPassword = Deno.env.get('SMTP_PASSWORD')

    if (!smtpHost || !smtpUser || !smtpPassword) {
      console.error('Variáveis de ambiente SMTP não configuradas (SMTP_HOST, SMTP_USER, SMTP_PASSWORD).')
      return new Response(JSON.stringify({ error: 'Configuração de e-mail ausente no servidor.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    const port = parseInt(smtpPort, 10)

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: port,
      secure: port === 465, // true para porta 465, false para outras (como 587, que usa STARTTLS)
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    })

    const nomeApresentacao = nome_usuario || 'Profissional'
    const nomeEmpresaApresentacao = empresa_nome ? ` da empresa <strong>${empresa_nome}</strong>` : ''

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; color: #333; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid #f1f5f9;">
          <h1 style="color: #2563eb; margin: 0; font-size: 24px;">MAPEAR Protagonista</h1>
          <p style="color: #64748b; margin-top: 5px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Cultura de Segurança</p>
        </div>
        
        <p style="font-size: 16px; color: #1e293b;">Olá <strong>${nomeApresentacao}</strong>,</p>
        
        <p style="font-size: 16px; line-height: 1.6; color: #334155;">
          Você foi convidado(a) para acessar a plataforma MAPEAR Protagonista${nomeEmpresaApresentacao}.
        </p>
        
        <p style="font-size: 16px; line-height: 1.6; color: #334155;">
          Nossa plataforma permite engajar funcionários na comunicação de riscos e comportamentos de segurança. 
          Para ativar sua conta e definir sua senha de acesso, clique no botão abaixo:
        </p>
        
        <div style="text-align: center; margin: 35px 0;">
          <a href="${link_convite}" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.1), 0 2px 4px -1px rgba(37, 99, 235, 0.06);">
            Ativar Minha Conta
          </a>
        </div>
        
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin-top: 20px;">
          <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin: 0;">
            Ou copie e cole o link abaixo no seu navegador:<br>
            <a href="${link_convite}" style="color: #2563eb; word-break: break-all; text-decoration: underline;">${link_convite}</a>
          </p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
        
        <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0; line-height: 1.4;">
          Se você não solicitou este convite ou desconhece esta plataforma, pode ignorar com segurança este e-mail.<br>
          Esta é uma mensagem automática, por favor não responda.
        </p>
      </div>
    `

    const info = await transporter.sendMail({
      from: `"MAPEAR Protagonista" <${smtpUser}>`, 
      to: email, 
      subject: "Convite de Acesso - MAPEAR Protagonista",
      html: html, 
    })

    console.log("E-mail enviado com sucesso. MessageId: %s", info.messageId)

    return new Response(JSON.stringify({ success: true, message: 'E-mail enviado com sucesso.', messageId: info.messageId }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 200,
    })
  } catch (error: any) {
    console.error('Erro ao enviar e-mail via SMTP:', error)
    return new Response(JSON.stringify({ error: error.message || 'Erro interno ao enviar e-mail via SMTP.' }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 500,
    })
  }
})
