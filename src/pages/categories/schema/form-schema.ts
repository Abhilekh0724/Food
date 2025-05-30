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
  })
  .refine((data) => {
    if (data.name && !data.slug) {
      data.slug = slugify(data.name);
    }
    return true;
  });

export type FormValues = z.infer<typeof formSchema>;
