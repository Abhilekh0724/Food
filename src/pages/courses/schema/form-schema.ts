import * as z from "zod";

const slugify = (value: string) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
};

export const formSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    slug: z.string(),
    duration: z.string().min(1, "Duration is required"), // Required category
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
    note: z.string().max(500, "Note must not exceed 500 characters"),
    mode: z.string(),
    price: z.preprocess(
      (val) => (typeof val === "string" ? Number(val) : val),
      z.number().positive("Price must be a positive number")
    ),
    category: z.string().min(1, "Category is required"),
    level: z.string().min(1, "Level is required"),
    designed_for: z.string(),
  })
  .refine((data) => {
    if (data.name && !data.slug) {
      data.slug = slugify(data.name);
    }
    return true;
  });
