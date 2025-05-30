import { z } from "zod";

// Schema for a single faq entry
const singleFaqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
});

// Schema for the entire form (array of faq entries)
export const faqSchema = z.object({
  faqs: z.array(singleFaqSchema).min(1, "At least one faq is required"),
});

export type FaqFormValues = z.infer<typeof faqSchema>;
