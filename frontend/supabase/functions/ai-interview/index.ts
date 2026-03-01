import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, role, difficulty, question, answer } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let prompt = "";
    if (action === "generate") {
      prompt = `Generate exactly 5 interview questions for the role of "${role}" at ${difficulty} difficulty level. Return ONLY a JSON array of strings, no other text. Example: ["Question 1?", "Question 2?"]`;
    } else if (action === "feedback") {
      prompt = `You are an expert interviewer. The candidate was asked: "${question}" for a ${role} position.\n\nTheir answer: "${answer}"\n\nProvide detailed feedback including:\n1. **Strengths** of the answer\n2. **Areas for improvement**\n3. **Sample ideal answer** (brief)\n4. **Score**: X/10\n\nBe constructive and encouraging.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) throw new Error("AI gateway error");
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    if (action === "generate") {
      try {
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        const questions = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
        return new Response(JSON.stringify({ questions }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch {
        return new Response(JSON.stringify({ questions: [content] }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ feedback: content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
