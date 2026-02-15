"use server";

import { db } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function checkUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const clerkUser = await currentUser();

  if (!clerkUser) return null;

  let user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    user = await db.user.create({
      data: {
        clerkUserId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        name: clerkUser.firstName || "",
      },
    });
  }

  return user;
}
