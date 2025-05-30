import * as z from "zod";

export const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email().min(1, "Email is required"),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  academicLevel: z.string().min(1, "Academic level is required"),
  occupation: z.string(),
  role: z.string(),
  gender: z.string().min(1, "Gender is required"),
  bloodGroup: z.string().min(1, "Blood group is required"),
  dob: z.date(),
  image: z
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

export type FormValues = z.infer<typeof formSchema>;
