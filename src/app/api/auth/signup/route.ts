import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { signupSchema } from "@/validations/auth.validation";
import { generateToken } from "@/auth/jwt";
import { createUser } from "@/services/auth.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData =
      signupSchema.parse(body);

    const user = await createUser(
      validatedData
    );

    const token = generateToken(
  user.id
);

const response =
  NextResponse.json(
    {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    },
    {
      status: 201,
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

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        message:
          error.issues[0]?.message ??
          "Validation failed",
      },
      {
        status: 400,
      }
    );
  }

  if (error instanceof Error) {
    switch (error.message) {

      case "EMAIL_ALREADY_EXISTS":
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

      case "PHONE_ALREADY_EXISTS":
        return NextResponse.json(
          {
            success: false,
            message:
              "Phone number already exists",
          },
          {
            status: 409,
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