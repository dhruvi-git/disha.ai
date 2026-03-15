import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateCareerAdvice(message: string) {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are an AI career coach helping users improve resumes, prepare for interviews, and plan careers.",
      },
      {
        role: "user",
        content: message,
      },
    ],
    model: "llama-3.1-8b-instant",
  });

  return completion.choices[0].message.content;
}