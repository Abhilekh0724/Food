import * as z from "zod";

export const formSchema = z.object({
  studentName: z.string().min(2, "Name must be at least 2 characters"),
  testimonial: z.string().min(1, "Testimonial is required"), // Required category
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
  rating: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z.number().positive("Rating must be a positive number")
  ),
  role: z.string().min(1, "Role is required"),
});
