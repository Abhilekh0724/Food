import * as z from "zod";

export const addressSchema = z.object({
  country: z.string().min(1, "Country is required"),
  district: z.string().min(1, "District is required"),
  municipality: z.string().min(1, "Municipality is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  streetAddress: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  wardNo: z.string().min(1, "Ward number is required"),
});

export const formSchema = z.object({
  currentAddress: addressSchema,
  permAddress: addressSchema,
});

export type FormValues = z.infer<typeof formSchema>;
