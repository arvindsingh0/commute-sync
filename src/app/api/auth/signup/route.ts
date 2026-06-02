import { NextResponse } from "next/server";

import { signupSchema } from "@/validations/auth.validation";
import { createUser } from "@/services/auth.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData =
      signupSchema.parse(body);

    const user = await createUser(
      validatedData
    );

    return NextResponse.json(
      {
        success: true,
        userId: user.id,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "EMAIL_ALREADY_EXISTS"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Email already exists",
        },
        {
          status: 409,
        }
      );
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