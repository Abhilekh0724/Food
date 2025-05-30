import * as z from "zod";

// Schema for FCM token object
export const fcmTokenSchema = z.object({
  enable: z.boolean(),
  token: z.string(),
});

// Schema for selected donor
export const selectedDonorSchema = z.object({
  id: z.string(),
  fcmTokens: fcmTokenSchema.array(),
});

// Main form schema
export const notifyDonorsSchema = z.object({
  title: z.string()
    .min(5, "Title must be at least 5 characters")
    .min(1, "Title is required"),
  message: z.string()
    .min(10, "Message must be at least 10 characters")
    .min(1, "Message is required")
    .max(90, "Message must be at atmost 90 characters"),
  selectedDonors: selectedDonorSchema
    .array()
    .min(1, "At least one donor must be selected")
});

// Type definitions
export interface FcmToken {
  enable: boolean;
  token: string;
}

export interface SelectedDonor {
  id: string;
  fcmTokens: FcmToken[];
}

export type NotifyDonorsFormValues = z.infer<typeof notifyDonorsSchema>;
