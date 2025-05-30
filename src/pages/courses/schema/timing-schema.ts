import { z } from "zod";

// Schema for a single time range
const timeRangeSchema = z.object({
  startTime: z
    .string()
    .regex(/^\d{2}:\d{2}:\d{2}$/, "Start time must be in HH:MM:SS format"),
  endTime: z
    .string()
    .regex(/^\d{2}:\d{2}:\d{2}$/, "End time must be in HH:MM:SS format"),
});

// Schema for a single timing entry
const timingSchema = z.object({
  date: z.date(),
  timeRanges: z
    .array(timeRangeSchema)
    .min(1, "At least one time range is required"),
});

// Schema for the entire form (array of timing entries)
export const timingsSchema = z.object({
  timings: z.array(timingSchema).min(1, "At least one timing is required"),
});

export type TimingsFormValues = z.infer<typeof timingsSchema>;
