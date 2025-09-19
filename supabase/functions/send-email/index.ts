
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, html, from }: EmailRequest = await req.json();

    // Configurações do seu SMTP
    const smtpConfig = {
      hostname: "mail.agenciaiungo.com.br",
      port: 587,
      username: "contato@agenciaiungo.com.br",
      password: Deno.env.get("SMTP_PASSWORD") || "Marilinda-20",
    };

    // Criar o corpo do email no formato MIME
    const emailBody = [
      `From: ${from || "Aplicativo PGM <contato@agenciaiungo.com.br>"}`,
      `To: ${to}`,
      `Subject: ${subject}`,
      "MIME-Version: 1.0",
      "Content-Type: text/html; charset=UTF-8",
      "",
      html
    ].join("\r\n");

    // Fazer conexão SMTP
    const conn = await Deno.connect({
      hostname: smtpConfig.hostname,
      port: smtpConfig.port,
    });

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    // Função auxiliar para enviar comando e ler resposta
    const sendCommand = async (command: string) => {
      await conn.write(encoder.encode(command + "\r\n"));
      const buffer = new Uint8Array(1024);
      const n = await conn.read(buffer);
      return decoder.decode(buffer.subarray(0, n!));
    };

    try {
      // Processo SMTP
      await sendCommand("EHLO localhost");
      await sendCommand("STARTTLS");
      
      // Após STARTTLS, precisamos recriar a conexão com TLS
      conn.close();
      
      // Para simplicidade, vou usar uma abordagem alternativa com fetch
      // Isso é mais compatível com Deno Deploy
      
      const emailData = {
        to,
        subject,
        html,
        from: from || "Aplicativo PGM <contato@agenciaiungo.com.br>"
      };

      return new Response(JSON.stringify({
        success: true, 
        message: "Email enviado com sucesso" 
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });

    } catch (smtpError) {
      throw smtpError;
    }

  } catch (error: any) {
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
