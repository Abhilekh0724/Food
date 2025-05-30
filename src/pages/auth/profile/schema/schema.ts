import * as z from "zod";

export const passwordFormSchema = z
  .object({
    oldPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    newPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

export type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export const profileFormSchema = z.object({
  fullName: z
    .string()
    .min(2, {
      message: "Full Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Full Name must not be longer than 30 characters.",
    }),
  email: z
    .string()
    .min(1, { message: "This field is required" })
    .email("This is not a valid email."),
  phone: z.string().optional(),
  bio: z
    .string()
    .max(160, {
      message: "Bio must not be longer than 160 characters.",
    })
    .optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
