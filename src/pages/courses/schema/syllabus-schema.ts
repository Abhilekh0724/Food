import { z } from "zod";

// Schema for a single syllabus entry
const singleSyllabusSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z
    .array(z.string().min(1, "Content item cannot be empty"))
    .min(1, "At least one content item is required"),
});

// Schema for the entire form (array of syllabus entries)
export const syllabusSchema = z.object({
  syllabuses: z
    .array(singleSyllabusSchema)
    .min(1, "At least one syllabus is required"),
});

export type SyllabusFormValues = z.infer<typeof syllabusSchema>;
