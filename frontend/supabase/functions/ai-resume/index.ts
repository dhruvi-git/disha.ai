import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, name, role, experience, skills, education, summary, resume } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let prompt = "";
    if (action === "generate") {
      prompt = `Create a professional, ATS-optimized resume in markdown format for:
Name: ${name}
Target Role: ${role}
Experience: ${experience || "Not specified"}
Skills: ${skills || "Not specified"}
Education: ${education || "Not specified"}
Summary: ${summary || "Generate one"}

Format it professionally with clear sections: Contact Info, Professional Summary, Experience, Skills, Education. Use bullet points and action verbs.`;
    } else if (action === "analyze") {
      prompt = `Analyze this resume and provide detailed feedback:\n\n${resume}\n\nProvide:\n1. **ATS Score**: X/100\n2. **Strengths**\n3. **Weaknesses**\n4. **Specific Improvements** (with examples)\n5. **Missing Keywords** for the industry\n6. **Overall Assessment**`;
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

    const key = action === "generate" ? "resume" : "feedback";
    return new Response(JSON.stringify({ [key]: content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
