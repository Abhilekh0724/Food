import * as z from "zod";

export const bloodTransferSchema = z.object({
  toOrganizer: z.string().min(1, "Organizer is required"),
  fromOrganizer: z.string().optional(),
  purpose: z.string().min(1, "Purpose is required"),
  noOfUnits: z.string().min(1, "Unit is required"),
  bloodType: z.string().min(1, "Blood type is required"),
  bloodGroup: z.string().min(1, "Blood group is required"),
  requestType: z.string().optional(),
  // requestedBloodPouches: z.array(z.string()).min(1, "At least one blood pouch is required"),
});

export type FormValues = z.infer<typeof bloodTransferSchema>;
