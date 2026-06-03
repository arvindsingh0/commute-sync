import { cookies } from "next/headers";

import { verifyToken } from "@/auth/jwt";

export async function getCurrentUserId() {
  const cookieStore = await cookies();

  const token =
    cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = verifyToken(token);

    return (
      payload as {
        userId: string;
      }
    ).userId;
  } catch {
    return null;
  }
}