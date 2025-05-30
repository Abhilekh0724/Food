import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createFaq, fetchFaq, updateFaq } from "@/store/features/course-slice";
import { dispatch, useSelector } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { FaqFormValues, faqSchema } from "../schema/faq-schema";

const FaqForm = ({ isEdit = false }: { isEdit?: boolean }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const loading = useSelector((state) => state.course.isLoading);
  const faq = useSelector((state) => state.course.singleData);
  const singleCourse = useSelector((state) => state.course.singleCourse);

  const form = useForm<FaqFormValues>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      faqs: [{ question: "", answer: "" }], // Initialize with one empty faq
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "faqs", // Ensure this matches the schema
  });

  const onSubmit = (data: FaqFormValues) => {
    dispatch(
      isEdit && id && faq?.length
        ? updateFaq({
            data: data.faqs.map((faq) => ({
              ...faq,
              course: id,
            })),
          })
        : createFaq({
            data: data.faqs.map((faq) => ({
              ...faq,
              course: id,
            })),
          })
    );
  };

  // TODO: fetch the faq
  useEffect(() => {
    if (isEdit && id) {
      dispatch(
        fetchFaq({
          params: {
            filters: {
              "course.id": {
                $eq: id,
              },
            },
            sort: "createdAt:ASC",
          },
        })
      );
    }
  }, [id, isEdit]);

  useEffect(() => {
    if (faq?.length) {
      form.reset({
        faqs: faq?.map((faq: any) => ({
          question: faq?.question,
          answer: faq?.answer,
        })),
      });
    }
  }, [form, faq]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Card className="my-6 p-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-20">
              {isEdit && id && faq?.length ? "Update" : "Add"}{" "}
              {singleCourse?.name || "Course"} Faq{" "}
            </CardTitle>
            <CardDescription>Enter the course faq</CardDescription>
          </CardHeader>

          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-4 p-4 border">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Faq {index + 1}</h3>
                  {/* Conditionally render the delete button */}
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <FormField
                  control={form.control}
                  name={`faqs.${index}.question`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`faqs.${index}.answer`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Answer *</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
        </Card>
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ question: "", answer: "" })}
          >
            Add Faq
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
          <Button
            disabled={loading}
            type="button"
            variant="outline"
            onClick={() => navigate("/courses")}
          >
            Cancel
          </Button>
          <Button disabled={loading} type="submit">
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Please wait
              </>
            ) : (
              <Button>
                {isEdit && id && faq?.length ? "Update" : "Add"} Course Faq
              </Button>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FaqForm;
