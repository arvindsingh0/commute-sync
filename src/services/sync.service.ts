import { prisma } from "@/lib/prisma";
import { CreateSyncInput } from "@/validations/sync.validation";

export async function createSync(
  creatorId: string,
  data: CreateSyncInput
) {
  const syncDate = new Date(data.syncDate);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxAllowedDate = new Date(today);
  maxAllowedDate.setDate(
    maxAllowedDate.getDate() + 3
  );

  if (
    syncDate < today ||
    syncDate > maxAllowedDate
  ) {
    throw new Error("INVALID_SYNC_DATE");
  }

  const activeSyncsCount =
    await prisma.sync.count({
      where: {
        creatorId,
        syncDate,
        status: {
          in: ["OPEN", "FULL"],
        },
      },
    });

  if (activeSyncsCount >= 4) {
    throw new Error(
      "MAX_DAILY_SYNCS_REACHED"
    );
  }

  const departureTime = new Date(
    data.departureTime
  );

  const twoHoursBefore = new Date(
    departureTime.getTime() -
      2 * 60 * 60 * 1000
  );

  const twoHoursAfter = new Date(
    departureTime.getTime() +
      2 * 60 * 60 * 1000
  );

  const similarSync =
    await prisma.sync.findFirst({
      where: {
        creatorId,

        syncDate,

        fromLocation: {
          equals: data.fromLocation,
          mode: "insensitive",
        },

        toLocation: {
          equals: data.toLocation,
          mode: "insensitive",
        },

        departureTime: {
          gte: twoHoursBefore,
          lte: twoHoursAfter,
        },

        status: {
          in: ["OPEN", "FULL"],
        },
      },
    });

  if (similarSync) {
    throw new Error(
      "SIMILAR_SYNC_EXISTS"
    );
  }

  const sync = await prisma.sync.create({
    data: {
      creatorId,

      fromLocation:
        data.fromLocation,

      toLocation:
        data.toLocation,

      syncDate,

      departureTime,

      seatsRequired:
        data.seatsRequired,

      womenOnly:
        data.womenOnly,

      notes: data.notes,
    },
  });

  return sync;
}

export async function searchSyncs(
  fromLocation: string,
  toLocation: string,
  syncDate: string
) {
  const date = new Date(syncDate);

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const syncs = await prisma.sync.findMany({
    where: {
      fromLocation: {
        equals: fromLocation,
        mode: "insensitive",
      },

      toLocation: {
        equals: toLocation,
        mode: "insensitive",
      },

      syncDate: {
        gte: startOfDay,
        lte: endOfDay,
      },

      status: {
        in: ["OPEN", "FULL"],
      },
    },

    orderBy: {
      departureTime: "asc",
    },

    include: {
      creator: {
        select: {
          id: true,
          name: true,
          isVerified: true,
        },
      },
    },
  });

  return syncs;
}
