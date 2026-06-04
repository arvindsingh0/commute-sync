import { NextResponse } from "next/server";

import { getCurrentUserId } from "@/auth/auth";

import { rejectRequest } from "@/services/sync.service";

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      requestId: string;
    }>;
  }
) {
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

  try {
    const { requestId } =
      await params;

    const result =
      await rejectRequest(
        requestId,
        userId
      );

    return NextResponse.json(
      result,
      {
        status: 200,
      }
    );
  } catch (error) {
    if (
      error instanceof Error
    ) {
      switch (error.message) {
        case "REQUEST_NOT_FOUND":
          return NextResponse.json(
            {
              success: false,
              message:
                "Request not found",
            },
            {
              status: 404,
            }
          );

        case "NOT_SYNC_OWNER":
          return NextResponse.json(
            {
              success: false,
              message:
                "You do not own this sync",
            },
            {
              status: 403,
            }
          );

        case "REQUEST_NOT_PENDING":
          return NextResponse.json(
            {
              success: false,
              message:
                "Request is not pending",
            },
            {
              status: 400,
            }
          );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}