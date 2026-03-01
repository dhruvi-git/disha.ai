import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { requireAuth, AuthRequest } from "./middleware/auth";
import { prisma } from "./lib/prisma";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

app.get("/me", requireAuth, async (req: AuthRequest, res) => {
  const clerkId = req.userId!;

  let user = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId,
        email: "temp@example.com",
      },
    });
  }

  res.json(user);
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});