import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "./lib/prisma";
import { requireAuth, AuthRequest } from "./middleware/auth";
import { generateCareerAdvice, refineResumeBullet } from "./services/aiService";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

app.get("/me", requireAuth, async (req: AuthRequest, res) => {
  try {

    const clerkId = req.userId!;
    const email = req.userEmail!;

    let user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId,
          email,
        },
      });
    }

    res.json(user);

  } catch (error) {

    console.error("ME route error:", error);
    res.status(500).json({ message: "Server error" });

  }
});

app.post("/ai/chat", requireAuth, async (req: AuthRequest, res) => {
  try {

    const { messages } = req.body;

    const clerkId = req.userId!;

    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { profile: true },
    });

    const profileContext = user?.profile
      ? `
User Profile:
Target Role: ${user.profile.targetRole}
Experience Level: ${user.profile.experienceLevel}
Skills: ${user.profile.skills?.join(", ")}
Bio: ${user.profile.bio}
`
      : "User profile not set yet.";

    const response = await generateCareerAdvice(messages, profileContext);

    res.json({ response });

  } catch (error) {

    console.error("AI error:", error);
    res.status(500).json({ message: "AI request failed" });

  }
});

app.post("/ai/refine-resume", requireAuth, async (req, res) => {
  try {

    const { text } = req.body;

    const response = await refineResumeBullet(text);

    res.json({ response });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Failed to refine resume" });

  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});