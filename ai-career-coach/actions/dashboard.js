"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Using the advanced Gemini 3 model for 2026-level reasoning
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

export const generateAIInsights = async (industry) => {
  const prompt = `
          Analyze the current state of the "${industry}" industry in INDIA (2026 market trends).
          Focus on data relevant to Indian job portals like Naukri, LinkedIn India, and Instahyre.
          
          Provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "High" | "Medium" | "Low",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "Positive" | "Neutral" | "Negative",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: 
          1. Return ONLY the JSON. No markdown formatting.
          2. Salary values must be in INR (Indian Rupees) normalized to Lakhs Per Annum (e.g., 12.5 for 12.5 LPA).
          3. Locations must be major Indian tech hubs (e.g., Bangalore, Pune, Gurgaon, Hyderabad, Remote-India).
          4. Include at least 5 common roles.
          5. Growth rate should be a percentage relative to the Indian economy.
        `;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

  return JSON.parse(cleanedText);
};

export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");

  // If no insights exist, generate them
  if (!user.industryInsight) {
    const insights = await generateAIInsights(user.industry);

    const industryInsight = await db.industryInsight.create({
      data: {
        industry: user.industry,
        ...insights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return industryInsight;
  }

  // Optional: Check if existing insights are expired (older than 7 days) and refresh if needed
  if (user.industryInsight && new Date() > new Date(user.industryInsight.nextUpdate)) {
      const freshInsights = await generateAIInsights(user.industry);
      const updatedInsight = await db.industryInsight.update({
          where: { id: user.industryInsight.id },
          data: {
              ...freshInsights,
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          }
      });
      return updatedInsight;
  }

  return user.industryInsight;
}