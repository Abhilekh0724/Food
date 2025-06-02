import { z } from "zod";

export const eventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  description: z.string().min(1, "Description is required"),
  eventDate: z.date({ required_error: "Event date is required" }),
  noOfParticipants: z.string().min(1, "Number of participants is required"),
  country: z.string().optional(),
  district: z.string().optional(),
  municipality: z.string().optional(),
  zipCode: z.string().optional(),
  streetAddress: z.string().optional(),
  city: z.string().optional(),
  wardNo: z.string().optional(),
  featureImage: z
    .custom<FileList>()
    .refine((files) => files?.length > 0, "Please upload image")
    .refine((files) => {
      if (
        typeof files?.[0] === "string" ||
        files?.[0]?.name?.startsWith("http")
      )
        return true;
      return (
        files?.length === 0 ||
        Array.from(files).every(
          (file) =>
            (file as File).type.startsWith("image/") &&
            (file as File).size <= 1 * 1024 * 1024
        )
      );
    }, "Image must be less than 1MB")
    .optional()
});

export type EventFormData = z.infer<typeof eventSchema>;
