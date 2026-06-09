import { NextResponse } from "next/server";

import { searchSyncs } from "@/services/sync.service";

export async function GET(
  req: Request
) {
  const { searchParams } =
    new URL(req.url);

  const fromLocation =
    searchParams.get("from");

  const toLocation =
    searchParams.get("to");

  const syncDate =
    searchParams.get("date");

  if (
    !fromLocation ||
    !toLocation ||
    !syncDate
  ) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Missing search parameters",
      },
      {
        status: 400,
      }
    );
  }

  const syncs =
    await searchSyncs(
      fromLocation,
      toLocation,
      syncDate
    );

  return NextResponse.json({
    success: true,
    syncs,
  });
}