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
import {
  createSyllabus,
  fetchSyllabus,
  updateSyllabus,
} from "@/store/features/course-slice";
import { dispatch, useSelector } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { SyllabusFormValues, syllabusSchema } from "../schema/syllabus-schema";

const SyllabusForm = ({ isEdit = false }: { isEdit?: boolean }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const loading = useSelector((state) => state.course.isLoading);
  const syllabus = useSelector((state) => state.course.singleData);
  const singleCourse = useSelector((state) => state.course.singleCourse);

  const form = useForm<SyllabusFormValues>({
    resolver: zodResolver(syllabusSchema),
    defaultValues: {
      syllabuses: [{ title: "", content: [] }], // Initialize with one empty syllabus
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "syllabuses", // Ensure this matches the schema
  });

  const onSubmit = (data: SyllabusFormValues) => {
    dispatch(
      isEdit && id && syllabus?.length
        ? updateSyllabus({
            data: data.syllabuses.map((syllabus) => ({
              ...syllabus,
              course: id,
            })),
          })
        : createSyllabus({
            data: data.syllabuses.map((syllabus) => ({
              ...syllabus,
              course: id,
            })),
          })
    );
  };

  // TODO: fetch the syllabus
  useEffect(() => {
    if (isEdit && id) {
      dispatch(
        fetchSyllabus({
          params: {
            filters: {
              "course.id": {
                $eq: id,
              },
            },
          },
        })
      );
    }
  }, [id, isEdit]);

  useEffect(() => {
    if (syllabus?.length) {
      form.reset({
        syllabuses: syllabus?.map((syllabus: any) => ({
          title: syllabus?.title,
          content: syllabus?.content,
        })),
      });
    }
  }, [form, syllabus]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Card className="my-6 p-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-20">
              {isEdit && id && syllabus?.length ? "Update" : "Add"}{" "}
              {singleCourse?.name || "Course"} Syllabus{" "}
            </CardTitle>
            <CardDescription>Enter the course syllabus</CardDescription>
          </CardHeader>

          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-4 p-4 border">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Syllabus {index + 1}</h3>
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
                  name={`syllabuses.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`syllabuses.${index}.content`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Content (press enter for new content)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field?.value?.join("\n")}
                          onChange={(e) =>
                            field.onChange(e.target.value.split("\n"))
                          }
                        />
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
            onClick={() => append({ title: "", content: [] })}
          >
            Add Syllabus
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
                {isEdit && id && syllabus?.length ? "Update" : "Add"} Course
                Syllabus
              </Button>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SyllabusForm;
