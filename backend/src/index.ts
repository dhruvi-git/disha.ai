import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "./lib/prisma";
import { requireAuth, AuthRequest } from "./middleware/auth";

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

import { generateCareerAdvice } from "./services/aiService";

app.post("/ai/chat", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { messages } = req.body;

    console.log("Chat request received");
    console.log("Messages:", messages.length);

    const response = await generateCareerAdvice(messages);

    res.json({ response });

  } catch (error) {
    console.error("❌ AI error:", error);
    res.status(500).json({ message: "AI request failed" });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


