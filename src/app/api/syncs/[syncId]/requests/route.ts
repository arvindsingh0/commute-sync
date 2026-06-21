import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/auth/auth";
import { getSyncWithRequests } from "@/services/sync.service";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      syncId: string;
    }>;
  }
) {
  const userId = await getCurrentUserId();

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
    const sync = await getSyncWithRequests(syncId, userId);

    return NextResponse.json({
      success: true,
      sync,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "SYNC_NOT_FOUND") {
        return NextResponse.json(
          {
            success: false,
            message: "Sync not found",
          },
          {
            status: 404,
          }
        );
      }
      if (error.message === "UNAUTHORIZED") {
        return NextResponse.json(
          {
            success: false,
            message: "You are not authorized to view requests for this sync",
          },
          {
            status: 403,
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
