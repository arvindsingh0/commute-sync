import { NextResponse } from "next/server";

import { getCurrentUserId } from "@/auth/auth";
import { createSyncSchema } from "@/validations/sync.validation";
import { createSync } from "@/services/sync.service";
import { searchSyncs } from "@/services/sync.service";

export async function POST(req: Request) {
  try {
    const creatorId = await getCurrentUserId();

    if (!creatorId) {
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

    const body = await req.json();

    const validatedData =
      createSyncSchema.parse(body);

    const sync = await createSync(
      creatorId,
      validatedData
    );

    return NextResponse.json(
      {
        success: true,
        sync,
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
        case "INVALID_SYNC_DATE":
          return NextResponse.json(
            {
              success: false,
              message:
                "Sync date must be within the next 3 days",
            },
            {
              status: 400,
            }
          );

        case "MAX_DAILY_SYNCS_REACHED":
          return NextResponse.json(
            {
              success: false,
              message:
                "Maximum 4 active syncs allowed per day",
            },
            {
              status: 400,
            }
          );

        case "SIMILAR_SYNC_EXISTS":
          return NextResponse.json(
            {
              success: false,
              message:
                "A similar sync already exists within 2 hours",
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
        message: "Invalid request",
      },
      {
        status: 400,
      }
    );
  }
}

export async function GET(
  req: Request
) {
  const { searchParams } =
    new URL(req.url);

  const from =
    searchParams.get("from");

  const to =
    searchParams.get("to");

  const date =
    searchParams.get("date");

  if (
    !from ||
    !to ||
    !date
  ) {
    return NextResponse.json(
      {
        success: false,
        message:
          "from, to and date are required",
      },
      {
        status: 400,
      }
    );
  }

  const syncs =
    await searchSyncs(
      from,
      to,
      date
    );

  return NextResponse.json({
    success: true,
    syncs,
  });
}