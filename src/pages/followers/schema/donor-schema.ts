import * as z from "zod";

export const donorSchema = z.object({
  weight: z.string().min(1, "Weight is required"),
  height: z.string().min(1, "Height is required"),
  lastDonationDate: z.date(),
  // Questionnaire fields
  everReceivedBlood: z.boolean().default(false),
  donatedBloodBefore: z.boolean().default(false),
  victimOfAnyDisease: z.boolean().default(false),
  hadVaccinationLast3Month: z.boolean().default(false),
  receiveDirectCall: z.boolean().default(false),
  receiveDirectMessage: z.boolean().default(false),
  attachments: z
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
    .optional(),
});

export type FormValues = z.infer<typeof donorSchema>;
