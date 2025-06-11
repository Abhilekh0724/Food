import { z } from "zod";

export const foodMenuSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  price: z.number().min(0, "Price must be positive"),
  description: z.string().optional(),
  imageUrl: z.string().url("Must be a valid URL").optional(),
  available: z.boolean().default(true),
  preparationTime: z.number().min(0, "Preparation time must be positive"),
  calories: z.number().min(0, "Calories must be positive"),
  ingredients: z.array(z.string()).default([]),
  dietaryInfo: z.array(z.string()).default([]),
});

export type FormValues = z.infer<typeof foodMenuSchema>; 