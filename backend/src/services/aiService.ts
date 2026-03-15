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
          "You are an AI career coach helping users improve their resumes, prepare for interviews, and plan their careers.",
      },
      {
        role: "user",
        content: message,
      },
    ],
    model: "llama3-8b-8192",
  });

  return completion.choices[0].message.content;
}