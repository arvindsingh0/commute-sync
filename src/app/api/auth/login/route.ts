import { NextResponse } from "next/server";

import { loginSchema } from "@/validations/login.validation";
import { loginUser } from "@/services/auth.service";
import { generateToken } from "@/auth/jwt";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData =
      loginSchema.parse(body);

    const user = await loginUser(
      validatedData
    );

    const token = generateToken(
      user.id
    );

    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      {
        status: 200,
      }
    );

    response.cookies.set(
      "token",
      token,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV ===
          "production",
        sameSite: "strict",
        maxAge:
          60 * 60 * 24 * 7,
        path: "/",
      }
    );

    return response;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "INVALID_CREDENTIALS"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid credentials",
        },
        {
          status: 401,
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