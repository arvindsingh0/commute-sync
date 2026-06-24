import { NextResponse } from "next/server";

import { getCurrentUserId } from "@/auth/auth";

import { requestToJoinSync } from "@/services/sync.service";

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      syncId: string;
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
    const { syncId } = await params;
    const body =
    await req.json().catch(
    () => ({})
    );

    const request =
      await requestToJoinSync(
        syncId,
        userId,
        body.message,
      );

    return NextResponse.json(
      {
        success: true,
        request,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    if (
      error instanceof Error
    ) {
      switch (error.message) {
        case "SYNC_NOT_FOUND":
          return NextResponse.json(
            {
              success: false,
              message:
                "Sync not found",
            },
            {
              status: 404,
            }
          );

        case "CANNOT_REQUEST_OWN_SYNC":
          return NextResponse.json(
            {
              success: false,
              message:
                "You cannot join your own sync",
            },
            {
              status: 400,
            }
          );

        case "SYNC_NOT_OPEN":
          return NextResponse.json(
            {
              success: false,
              message:
                "Sync is not accepting requests",
            },
            {
              status: 400,
            }
          );

        case "REQUEST_ALREADY_EXISTS":
          return NextResponse.json(
            {
              success: false,
              message:
                "Request already sent",
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
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}
