"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

/* =====================================================
   GEMINI SETUP
===================================================== */

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use stable production model
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

/* =====================================================
   SAFE JSON PARSER
===================================================== */

function safeParseJSON(text) {
  try {
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (err) {
    console.error("JSON Parse Error:", err);
    console.error("Raw AI Response:", text);
    return null;
  }
}

/* =====================================================
   GENERATE AI INSIGHTS
===================================================== */

export const generateAIInsights = async (industry) => {
  try {
    const prompt = `
Analyze the "${industry}" industry in INDIA (2026 market trends).

Return ONLY valid JSON in this exact structure:

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

Rules:
- No markdown
- No explanations
- Salary in LPA (Lakhs Per Annum)
- At least 5 roles
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Gemini Raw Response:", text);

    const parsed = safeParseJSON(text);

    if (!parsed) {
      throw new Error("AI returned invalid JSON");
    }

    // Minimal validation
    if (!parsed.salaryRanges || !Array.isArray(parsed.salaryRanges)) {
      throw new Error("Invalid salaryRanges format");
    }

    return parsed;

  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw new Error("Failed to generate AI insights");
  }
};

/* =====================================================
   GET INDUSTRY INSIGHTS
===================================================== */

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

  if (!user.industry) {
    throw new Error("User has no industry selected");
  }

  /* ------------------------------
     If no insights exist
  ------------------------------ */
  if (!user.industryInsight) {
    console.log("No insights found — generating new ones");

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

  /* ------------------------------
     If expired (older than 7 days)
  ------------------------------ */
  if (new Date() > new Date(user.industryInsight.nextUpdate)) {
    console.log("Insights expired — regenerating");

    const freshInsights = await generateAIInsights(user.industry);

    const updatedInsight = await db.industryInsight.update({
      where: { id: user.industryInsight.id },
      data: {
        ...freshInsights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return updatedInsight;
  }

  return user.industryInsight;
}
