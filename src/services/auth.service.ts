import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/auth/hash";
import { SignupInput } from "@/validations/auth.validation";

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