"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function checkUser() {
  const { userId } = await auth();

  if (!userId) return null;

  let user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    user = await db.user.create({
      data: {
        clerkUserId: userId,
      },
    });
  }

  return user;
}
