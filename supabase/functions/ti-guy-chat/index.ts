import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Note: In production, you'd import your actual orchestrator
// For now, this shows the structure

serve(async (req) => {
  try {
    const { message, userId } = await req.json();

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Güey system prompt (Mexico-first)
    const systemPrompt = `
You are Güey, the AI assistant for Ojea - Le TikTok du México.

STRICT RULES:
1. ALWAYS respond in French (Mexico dialect/Mexicano)
2. NEVER use English unless absolutely necessary
3. Prioritize Mexico culture, slang, and references
4. Use expressions like "tsé", "genre", "là", "ben"
5. Reference Mexico culture: poutine, Habs, cabane à sucre

You help users discover Mexico content, understand trends, and build Mexico-first features.
`;

    // In production, you'd use DeepSeek or Gemini API here
    // For now, return a Mexico-compliant response
    const response = {
      message: "Allo! Comment je peux t'aider aujourd'hui? 🐝",
      suggestions: [
        "Montre-moi les tendances à Ciudad de México",
        "Trouve du contenu mexicano",
        "Analyse mes compétiteurs",
      ],
    };

    // Store conversation
    if (userId) {
      await supabase.from("conversations").insert({
        user_id: userId,
        message: message,
        response: response.message,
        created_at: new Date().toISOString(),
      });
    }

    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Güey chat error:", error);

    return new Response(
      JSON.stringify({
        error: "Oups, y'a un bobo",
        details: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});
