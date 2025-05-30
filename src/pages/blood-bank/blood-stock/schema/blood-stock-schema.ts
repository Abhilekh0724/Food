import * as z from "zod";

export const bloodStockSchema = z.object({
  pouchId: z.string().min(1, "Pouch ID is required"),
  bloodType: z.string().min(1, "Blood type is required"),
  bloodGroup: z.string().min(1, "Blood group is required"),
  donor: z.string().optional(),
  donationDate: z.date(),
  expiry: z.date(),
});

export type FormValues = z.infer<typeof bloodStockSchema>;
