import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/auth/auth";

export async function GET() {
  const userId =
    await getCurrentUserId();

  if (!userId) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const user =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isVerified: true,
      },
    });

  return NextResponse.json({
    success: true,
    user,
  });
}