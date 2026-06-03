import { prisma } from "@/lib/prisma";

import {
  hashPassword,
  comparePassword,
} from "@/auth/hash";

import { SignupInput } from "@/validations/auth.validation";
import { LoginInput } from "@/validations/login.validation";

export async function createUser(data: SignupInput) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const hashedPassword = await hashPassword(
    data.password
  );

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      gender: "PREFER_NOT_TO_SAY",
    },
  });

  return user;
}

export async function loginUser(
  data: LoginInput
) {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new Error(
      "INVALID_CREDENTIALS"
    );
  }

  const isPasswordValid =
    await comparePassword(
      data.password,
      user.password
    );

  if (!isPasswordValid) {
    throw new Error(
      "INVALID_CREDENTIALS"
    );
  }

  return user;
}