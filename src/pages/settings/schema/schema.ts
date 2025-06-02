import * as z from "zod"

export const profileFormSchema = z.object({
  organizationName: z.string().min(2, {
    message: "Organization name must be at least 2 characters.",
  }),
  organizationType: z.string({
    required_error: "Please select an organization type.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  phoneNumber: z.string().min(1, {
    message: "Phone number is required.",
  }),
  emailAddress: z.string().email({
    message: "Please enter a valid email address.",
  }),
  country: z.string().optional(),
  district: z.string().optional(),
  municipality: z.string().optional(),
  zipCode: z.string().optional(),
  streetAddress: z.string().optional(),
  city: z.string().optional(),
  wardNo: z.string().optional(),
  logo: z.any().optional(),
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>
