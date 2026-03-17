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

app.post("/achievements", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { title, description, type, date } = req.body;

    const user = await prisma.user.findUnique({
      where: { clerkId: req.userId! },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const achievement = await prisma.achievement.create({
      data: {
        title,
        description,
        type,
        date: new Date(date),
        userId: user.id,
      },
    });

    res.json(achievement);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create achievement" });
  }
});

app.get("/achievements", requireAuth, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: req.userId! },
      include: { achievements: true },
    });

    res.json(user?.achievements || []);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch achievements" });
  }
});

app.delete("/achievements/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.achievement.delete({
      where: { id },
    });

    res.json({ message: "Deleted" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete" });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});