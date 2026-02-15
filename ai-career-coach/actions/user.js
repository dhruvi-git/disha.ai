"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateAIInsights } from "./dashboard";

/* ============================
   UPDATE USER PROFILE
============================ */
export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const skillsArray =
      typeof data.skills === "string"
        ? data.skills.split(",").map((skill) => skill.trim())
        : data.skills;

    const result = await db.$transaction(async (tx) => {
      let industryInsight = await tx.industryInsight.findUnique({
        where: { industry: data.industry },
      });

      if (!industryInsight) {
        let insights;

        try {
          // Try AI generation
          insights = await generateAIInsights(data.industry);
        } catch (err) {
          console.error("AI failed, using fallback:", err.message);

          // Fallback default values
          insights = {
            salaryRanges: [],
            growthRate: 0,
            demandLevel: "Medium",
            topSkills: [],
            marketOutlook: "Neutral",
            keyTrends: [],
            recommendedSkills: [],
          };
        }

        industryInsight = await tx.industryInsight.create({
          data: {
            industry: data.industry,
            ...insights,
            nextUpdate: new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000
            ),
          },
        });
      }

      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          industry: data.industry,
          experience: parseInt(data.experience, 10),
          bio: data.bio,
          skills: skillsArray,
        },
      });

      return { updatedUser, industryInsight };
    });

    revalidatePath("/");
    return result.updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update profile");
  }
}
