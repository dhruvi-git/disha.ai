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
You are Disha AI, a personalized AI career coach.

Use the user's profile information to give tailored career advice.

${profileContext}
        `,
      },

      ...messages,
    ],
  });

  const response = completion.choices[0].message.content;

  console.log("GROQ RESPONSE RECEIVED");

  return response;
}