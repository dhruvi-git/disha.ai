import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateCareerAdvice(messages: any[], profileContext: string) {

  console.log("Sending request to GROQ...");
  console.log("Model:", "llama-3.1-8b-instant");

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",

    messages: [
      {
        role: "system",
        content: `
You are Disha AI, a professional AI career coach.

Use the user's profile information to personalize your responses.

Provide:
• Clear advice
• Actionable steps
• Structured responses
• Practical career guidance

${profileContext}
`,
      },

      ...messages,
    ],
  });

  const response = completion.choices[0].message.content || "";

  console.log("GROQ RESPONSE RECEIVED");

  return response;
}

export async function refineResumeBullet(text: string) {

  console.log("Refining resume bullet with GROQ");

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",

    messages: [
      {
        role: "system",
        content:
          "You are an expert resume writer. Rewrite the user's bullet point to be concise, results-oriented, and ATS friendly. Use strong action verbs and quantify results where possible.",
      },
      {
        role: "user",
        content: text,
      },
    ],
  });

  return completion.choices[0].message.content || "";
}