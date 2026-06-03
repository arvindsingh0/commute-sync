import { z } from "zod";

export const createSyncSchema = z
  .object({
    fromLocation: z
      .string()
      .trim()
      .min(2)
      .max(100),

    toLocation: z
      .string()
      .trim()
      .min(2)
      .max(100),

    syncDate: z.string().date(),

    departureTime: z.string(),

    seatsRequired: z
      .number()
      .int()
      .min(1)
      .max(6),

    womenOnly: z.boolean(),

    notes: z
      .string()
      .trim()
      .max(500)
      .optional(),
  })
  .refine(
    (data) =>
      data.fromLocation
        .trim()
        .toLowerCase() !==
      data.toLocation
        .trim()
        .toLowerCase(),
    {
      message:
        "Source and destination cannot be the same",
      path: ["toLocation"],
    }
  );

export type CreateSyncInput =
  z.infer<typeof createSyncSchema>;