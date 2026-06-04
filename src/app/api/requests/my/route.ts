import { NextResponse } from "next/server";

import { getCurrentUserId } from "@/auth/auth";

import { getMyRequests } from "@/services/sync.service";

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

  const requests =
    await getMyRequests(userId);

  return NextResponse.json({
    success: true,
    requests,
  });
}