import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateCareerAdvice(messages: any[]) {

  console.log("Sending request to GROQ...");

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",

    messages: [
      {
        role: "system",
        content:
          "You are Disha AI, an expert AI career coach helping users with resumes, interviews, career planning, job searching, and skill development. Provide structured, clear and actionable advice.",
      },

      ...messages,
    ],
  });

  const response = completion.choices[0].message.content;

  console.log("GROQ RESPONSE RECEIVED");

  return response;
}