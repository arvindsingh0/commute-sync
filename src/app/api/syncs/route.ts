import { ZodError } from "zod";

import { NextResponse } from "next/server";

import { getCurrentUserId } from "@/auth/auth";

import {
  createSyncSchema,
} from "@/validations/sync.validation";

import {
  createSync,
} from "@/services/sync.service";



export async function POST(
  req: Request
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
    const body =
      await req.json();

    const validatedData =
      createSyncSchema.parse(
        body
      );

    const sync =
      await createSync(
        userId,
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
  } 
  catch (error) {
    if (
      error instanceof Error
    ) {
      switch (error.message) {
        case "INVALID_SYNC_DATE":
          return NextResponse.json(
            {
              success: false,
              message:
                "Date must be within the next 4 days",
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
                "You can only create 4 syncs per day",
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
                "A similar sync already exists",
            },
            {
              status: 400,
            }
          );
      }
    }

    console.log(error);

return NextResponse.json(
  {
    success: false,
    message:
      error instanceof Error
        ? error.message
        : "Unknown error",
  },
  {
    status: 400,
  }
);
  }
}