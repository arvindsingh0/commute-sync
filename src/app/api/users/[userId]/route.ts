import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      userId: string;
    }>;
  }
) {
  const { userId } =
    await params;

  const user =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,
        name: true,
        company: true,
        gender: true,
        isVerified: true,

        _count: {
          select: {
            syncs: true,
            requests: {
              where: {
                status:
                  "ACCEPTED",
              },
            },
          },
        },
      },
    });

  if (!user) {
    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json({
    success: true,
    user,
  });
}