// /supabase/functions/send-email/index.ts

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Pegue a chave de API dos segredos do Supabase
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
}

serve(async (req: Request) => {
  // Trata a requisição preflight de CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { to, subject, html }: EmailRequest = await req.json();

    if (!RESEND_API_KEY) {
      throw new Error("A chave de API do Resend não foi configurada.");
    }

    // Faz a chamada para a API do Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Seu Nome <voce@seudominioverificadonoresend.com>', // IMPORTANTE: use um e-mail de um domínio verificado no Resend
        to: [to],
        subject: subject,
        html: html,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Falha ao enviar o e-mail.');
    }

    return new Response(JSON.stringify({ success: true, message: "E-mail enviado com sucesso!", data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});