import Loader from "@/components/common/loader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/auth-context";
import { deleteImage } from "@/store/features/media-slice";
import {
  createSuccessStory,
  fetchSingleSuccessStory,
  updateSuccessStory,
} from "@/store/features/success-stories-slice";
import { dispatch, useSelector } from "@/store/store";
import { appendFormData } from "@/util/append-formdata";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FileIcon,
  Loader2,
  StickyNote,
  UploadIcon,
  XCircleIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as z from "zod";
import { formSchema } from "../schema/form-schema";

type FormValues = z.infer<typeof formSchema>;

export default function AddSuccessStoryPage({
  isEdit = false,
}: {
  isEdit?: boolean;
}) {
  const navigate = useNavigate();

  const { user } = useAuth();

  const { id } = useParams();

  const [documentPreviews, setDocumentPreviews] = useState<string[]>([]);

  const loading = useSelector((state) => state.successStory.isLoading);
  const fetchLoading = useSelector((state) => state.successStory.fetchLoading);
  const singleSuccessStory = useSelector(
    (state) => state.successStory.singleData
  );
  const courses = useSelector((state) => state.course.data)?.data;

  // TODO: fetch the single successStory
  useEffect(() => {
    if (isEdit && id) {
      dispatch(
        fetchSingleSuccessStory({
          id,
          params: {
            populate: "image,course",
          },
        })
      );
    }
  }, [id, isEdit]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentName: "",
      company: "",
      story: "",
      position: "",
      image: new DataTransfer().files,
    },
  });

  // TODO: set the values in form

  useEffect(() => {
    if (singleSuccessStory && id) {
      form.reset({
        studentName: singleSuccessStory?.studentName || "",
        course: singleSuccessStory?.course?.id || "",
        story: singleSuccessStory?.story || "",
        company: singleSuccessStory?.company || "",
        position: singleSuccessStory?.position || "",
        image: (() => {
          const dataTransfer = new DataTransfer();
          if (singleSuccessStory?.image?.url) {
            const file = new File([], singleSuccessStory.image.url);
            dataTransfer.items.add(file);
          }
          return dataTransfer.files;
        })(), // Ensure files default to empty
      });

      setDocumentPreviews([singleSuccessStory?.image?.url]);
    }
  }, [singleSuccessStory, form, user?.id, id]);

  const onSubmit = (data: FormValues) => {
    const formData = new FormData();

    let image = data?.image;

    // If image is an array of strings, set it to undefined
    if (
      Array.isArray(image) &&
      image.every((item) => typeof item === "string")
    ) {
      image = undefined;
    }
    // If image is a FileList or an array of File objects
    else if (image instanceof FileList || Array.isArray(image)) {
      const validFiles = Array.from(image).filter(
        (file) => !file.name.startsWith("http") // Keep only those files whose name does NOT start with "http"
      );

      // Convert valid files to FileList using DataTransfer
      const dataTransfer = new DataTransfer();
      validFiles.forEach((file) => dataTransfer.items.add(file));

      // If no valid files remain, set image to undefined
      image = validFiles.length > 0 ? dataTransfer.files : undefined;
    }

    appendFormData(formData, {
      ...data,
      image,
    });

    isEdit && id
      ? dispatch(
          updateSuccessStory({
            data: formData,
            navigate,
            id,
          })
        )
      : dispatch(
          createSuccessStory({
            data: formData,
            navigate,
          })
        );
  };

  return (
    <>
      {fetchLoading ? (
        <Loader />
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex gap-10 flex-wrap">
              <Card className="my-6 p-2 sm:p-6 flex-[2]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-20">
                    {isEdit && id ? "Update" : "Add New"} Story{" "}
                  </CardTitle>
                  {!(isEdit && id) && (
                    <CardDescription>Enter the success story</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="studentName"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>Student Name *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            {/* <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /> */}
                            <Input
                              className="pl-3"
                              placeholder="Eg: Saroj Dangol"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>Position *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              className="pl-3"
                              placeholder="Eg: Developer"
                              type="text"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>Company *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              className="pl-3"
                              placeholder="Eg: Developer"
                              type="text"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="story"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>Story *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <StickyNote className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Textarea
                              className="pl-9"
                              placeholder="Write story"
                              type="text"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="my-6 p-2 flex-1">
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="course"
                    render={({
                      field,
                    }: {
                      field: {
                        onChange: (value: string) => void;
                        value: string;
                      };
                    }) => (
                      <FormItem>
                        <FormLabel>Course *</FormLabel>
                        <Select
                          key={field.value}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Course" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {courses?.map((c: any, i: number) => (
                              <SelectItem key={i} value={c?.id}>
                                {c?.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field: { onChange, value, ...field } }) => (
                      <FormItem>
                        <FormLabel>Image *</FormLabel>
                        <FormControl>
                          <div className="space-y-3">
                            {/* Custom Upload Button */}
                            <label
                              htmlFor="file-upload"
                              className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer transition"
                            >
                              <UploadIcon className="w-8 h-8" />
                              <span className="text-sm mt-2">
                                Click to upload or drag and drop
                              </span>
                              <span className="text-xs">
                                (PDF, DOC, DOCX, PNG, JPG, JPEG - Max 5MB each)
                              </span>
                            </label>

                            <Input
                              id="file-upload"
                              type="file"
                              className="hidden"
                              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif,.bmp"
                              onChange={(e) => {
                                const files = e.target.files;
                                const newFiles = new DataTransfer();

                                if (files) {
                                  Array.from(files).forEach((file) => {
                                    if (file instanceof File) {
                                      newFiles.items.add(file); // Add only File objects
                                    }
                                  });

                                  onChange(newFiles.files);

                                  // Handle file previews
                                  const previews = Array.from(files).map(
                                    (file) => {
                                      if (file.type.startsWith("image/")) {
                                        return URL.createObjectURL(file);
                                      }
                                      return `${file.name} (${(
                                        file.size /
                                        1024 /
                                        1024
                                      ).toFixed(2)}MB)`;
                                    }
                                  );

                                  setDocumentPreviews((prev) => [...previews]);
                                }
                              }}
                              {...field}
                            />

                            {/* Preview Section */}
                            {documentPreviews?.length > 0 && (
                              <div className="grid grid-cols-3 gap-5">
                                {documentPreviews?.map((preview, index) => (
                                  <div
                                    key={index}
                                    className="relative p-2 border rounded-lg bg-white shadow-md w-full"
                                  >
                                    {preview?.startsWith("blob:") ||
                                    preview?.startsWith("http") ? (
                                      <div className="relative w-full h-full rounded-md overflow-hidden">
                                        <img
                                          src={preview}
                                          alt={`Preview ${index + 1}`}
                                          className="object-cover w-full h-full rounded-md aspect-square"
                                        />
                                      </div>
                                    ) : (
                                      <div className="flex flex-col items-center justify-center w-full h-full bg-gray-200 rounded-lg">
                                        <FileIcon className="w-6 h-6 text-gray-600" />
                                        <span className="text-xs text-gray-700 mt-1 text-center">
                                          {preview}
                                        </span>
                                      </div>
                                    )}
                                    {/* Delete Button */}
                                    <button
                                      type="button"
                                      className="absolute -top-2 -right-2 bg-white p-1 rounded-full shadow-sm hover:bg-gray-200"
                                      onClick={() => {
                                        const fileToDelete =
                                          documentPreviews[index];

                                        if (fileToDelete?.startsWith("http"))
                                          dispatch(
                                            deleteImage({
                                              id: singleSuccessStory?.image?.id,
                                            })
                                          );
                                        // Remove from previews

                                        const updatedPreviews =
                                          documentPreviews.filter(
                                            (_, i) => i !== index
                                          );
                                        setDocumentPreviews(updatedPreviews);

                                        // Remove from image files
                                        const currentFiles =
                                          form.getValues("image");

                                        if (currentFiles) {
                                          const newFiles = new DataTransfer();
                                          Array.from(currentFiles).forEach(
                                            (file, i) => {
                                              if (i !== index) {
                                                if (file instanceof File) {
                                                  newFiles.items.add(file);
                                                } else if (
                                                  typeof file === "string"
                                                ) {
                                                  const fileExtension =
                                                    (file as string)
                                                      .split(".")
                                                      .pop() || "";
                                                  newFiles.items.add(
                                                    new File([], file, {
                                                      type: `image/${fileExtension}`,
                                                    })
                                                  );
                                                }
                                              }
                                            }
                                          );
                                          form.setValue(
                                            "image",
                                            newFiles.files
                                          );
                                        }
                                      }}
                                    >
                                      <XCircleIcon className="w-4 h-4 text-gray-600" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
              <Button
                disabled={loading}
                type="button"
                variant="outline"
                onClick={() => navigate("/success-stories")}
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
                  <>{isEdit && id ? "Update" : "Add"} SuccessStory</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
}
