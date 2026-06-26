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
  syncDate: string,
  currentUserId: string
) {
  const date = new Date(syncDate);

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const now = new Date();

  const syncs = await prisma.sync.findMany({
    where: {
      creatorId: {
        not: currentUserId,
     },
      fromLocation: {
        equals: fromLocation,
        mode: "insensitive",
      },

      toLocation: {
        equals: toLocation,
        mode: "insensitive",
      },
      departureTime: {
        gte: now,
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
      requests: {
        where: {
          senderId: currentUserId,
        },
        select: {
          status: true,
        },
      },
    },
  });

  return syncs;
}


export async function requestToJoinSync(
  syncId: string,
  senderId: string,
  message?: string
) {
  const sync = await prisma.sync.findUnique({
    where: {
      id: syncId,
    },
  });

  if (!sync) {
    throw new Error("SYNC_NOT_FOUND");
  }

  if (sync.creatorId === senderId) {
    throw new Error(
      "CANNOT_REQUEST_OWN_SYNC"
    );
  }

  if (sync.status !== "OPEN") {
    throw new Error(
      "SYNC_NOT_OPEN"
    );
  }

  const existingRequest =
    await prisma.syncRequest.findUnique({
      where: {
        syncId_senderId: {
          syncId,
          senderId,
        },
      },
    });

  if (existingRequest) {
    throw new Error(
      "REQUEST_ALREADY_EXISTS"
    );
  }

  const request =
    await prisma.syncRequest.create({
      data: {
        syncId,
        senderId,
        message,
      },
    });

  return request;
}

export async function getMySyncs(
  creatorId: string
) {
  const syncs =
    await prisma.sync.findMany({
      where: {
        creatorId,
      },

      orderBy: {
        departureTime: "asc",
      },

      include: {
        requests: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                isVerified: true,
              },
            },
          },

          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

  return syncs;
}

export async function acceptRequest(
  requestId: string,
  currentUserId: string

) {
const request =
  await prisma.syncRequest.findUnique({
    where: {
      id: requestId,
    },

    include: {
      sync: true,
      sender: true,
    },
  });

if (!request) {
  throw new Error(
    "REQUEST_NOT_FOUND"
  );
}
if (
  request.sync.creatorId !==
  currentUserId
) {
  throw new Error(
    "NOT_SYNC_OWNER"
  );
}
if (
  request.status !== "PENDING"
) {
  throw new Error(
    "REQUEST_NOT_PENDING"
  );
}
if (
  request.sync.status ===
  "FULL"
) {
  throw new Error(
    "SYNC_ALREADY_FULL"
  );
}
return prisma.$transaction(
  async (tx) => {
    const updateResult = await tx.syncRequest.updateMany({
      where: {
        id: requestId,
        status: "PENDING",
      },
      data: {
        status: "ACCEPTED",
      },
    });

    if (updateResult.count === 0) {
      throw new Error("REQUEST_NOT_PENDING");
    }

    const updatedSync =
      await tx.sync.update({
        where: {
          id: request.syncId,
        },

        data: {
          acceptedSeats: {
            increment: 1,
          },
        },
      });

    if (
      updatedSync.acceptedSeats >=
      updatedSync.seatsRequired
    ) {
      await tx.sync.update({
        where: {
          id: request.syncId,
        },

        data: {
          status: "FULL",
        },
      });

      await tx.syncRequest.updateMany({
        where: {
          syncId: request.syncId,

          status: "PENDING",
        },

        data: {
          status: "REJECTED",
        },
      });
    }

    await tx.syncRequest.updateMany({
      where: {
        senderId: request.senderId,

        id: {
          not: requestId,
        },

        status: "PENDING",
      },

      data: {
        status: "REJECTED",
      },
    });

    return {
      success: true,
    };
  }
);
}

export async function rejectRequest(
  requestId: string,
  currentUserId: string
) {
  const request =
    await prisma.syncRequest.findUnique({
      where: {
        id: requestId,
      },

      include: {
        sync: true,
      },
    });

  if (!request) {
    throw new Error(
      "REQUEST_NOT_FOUND"
    );
  }

  if (
    request.sync.creatorId !==
    currentUserId
  ) {
    throw new Error(
      "NOT_SYNC_OWNER"
    );
  }

  const updateResult = await prisma.syncRequest.updateMany({
    where: {
      id: requestId,
      status: "PENDING",
    },
    data: {
      status: "REJECTED",
    },
  });

  if (updateResult.count === 0) {
    throw new Error("REQUEST_NOT_PENDING");
  }

  return {
    success: true,
  };
}

export async function getMyRequests(
  userId: string
) {
  const requests =
    await prisma.syncRequest.findMany({
      where: {
        senderId: userId,
      },

      orderBy: {
        createdAt: "desc",
      },

      include: {
        sync: {
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                isVerified: true,
              },
            },
          },
        },
      },
    });

  return requests;
}

export async function getSyncWithRequests(
  syncId: string,
  userId: string
) {
  const sync = await prisma.sync.findUnique({
    where: {
      id: syncId,
    },
    include: {
      requests: {
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNumber: true,
              profileImage: true,
              company: true,
              gender: true,
              isVerified: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!sync) {
    throw new Error("SYNC_NOT_FOUND");
  }

  if (sync.creatorId !== userId) {
    throw new Error("UNAUTHORIZED");
  }

  return sync;
}