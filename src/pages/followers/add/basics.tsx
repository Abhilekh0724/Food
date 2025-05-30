import Loader from "@/components/common/loader";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { bloodGroupOptions } from "@/data/blood-group";
import { genderOptions } from "@/data/gender";
import { fetchSingleAdmins, updateAdmin } from "@/store/features/admin-slice";
import { dispatch, useSelector } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileIcon, Loader2, UploadIcon, XCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { formSchema, FormValues } from "../schema/form-schema";

const AddBasicProfile = ({ isEdit = false }: { isEdit?: boolean }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [documentPreviews, setDocumentPreviews] = useState<string[]>([]);

  const fetchLoading = useSelector((state) => state.admin.fetchLoading);
  const loading = useSelector((state) => state.admin.isLoading);
  const singleAdmin = useSelector((state) => state.admin.singleData);

  // TODO: fetch the single admin
  useEffect(() => {
    if (isEdit && id) {
      dispatch(
        fetchSingleAdmins({
          id,
          params: {
            populate: "course",
          },
        })
      );
    }
  }, [id, isEdit]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      occupation: "",
      gender: "",
      image: new DataTransfer().files,
    },
  });

  const onSubmit = (data: FormValues) => {
    dispatch(
      updateAdmin({
        data,
        navigate,
        id,
      })
    );
  };

  useEffect(() => {
    if (singleAdmin && id) {
      form.reset({
        firstName: singleAdmin?.firstName || "",
        lastName: singleAdmin?.lastName || "",
        email: singleAdmin?.email || "",
        phone: singleAdmin?.phone || "",
        occupation: singleAdmin?.occupation || "",
        gender: singleAdmin?.gender || "",
        image: (() => {
          const dataTransfer = new DataTransfer();
          if (singleAdmin?.image?.url) {
            const file = new File([], singleAdmin.image.url);
            dataTransfer.items.add(file);
          }
          return dataTransfer.files;
        })(), // Ensure files default to empty
      });
    }
  }, [singleAdmin, form, id]);

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
                    {isEdit
                      ? `Update Basic Info of ${singleAdmin?.studentName}`
                      : "Add Basic Info of Admin"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }: { field: any }) => (
                        <FormItem>
                          <FormLabel>First Name *</FormLabel>
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
                      name="lastName"
                      render={({ field }: { field: any }) => (
                        <FormItem>
                          <FormLabel>Last Name *</FormLabel>
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
                      name="email"
                      render={({ field }: { field: any }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              {/* <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /> */}
                              <Input
                                type="email"
                                className="pl-3"
                                placeholder="Eg: example@gmail.com"
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
                      name="phone"
                      render={({ field }: { field: any }) => (
                        <FormItem>
                          <FormLabel>Phone *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              {/* <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /> */}
                              <Input
                                className="pl-3"
                                placeholder="Eg: 9863485599"
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
                      name="gender"
                      render={({
                        field,
                      }: {
                        field: {
                          onChange: (value: string) => void;
                          value: string;
                        };
                      }) => (
                        <FormItem>
                          <FormLabel>Gender *</FormLabel>
                          <Select
                            key={field.value}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {genderOptions?.map((c, i) => (
                                <SelectItem key={i} value={c?.value}>
                                  {c?.label}
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
                      name="bloodGroup"
                      render={({
                        field,
                      }: {
                        field: {
                          onChange: (value: string) => void;
                          value: string;
                        };
                      }) => (
                        <FormItem>
                          <FormLabel>Blood Group *</FormLabel>
                          <Select
                            key={field.value}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Blood Group" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {bloodGroupOptions?.map((bg, i) => (
                                <SelectItem key={i} value={String(bg?.value)}>
                                  {bg?.label}
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
                      name="occupation"
                      render={({ field }: { field: any }) => (
                        <FormItem>
                          <FormLabel>Occupation</FormLabel>
                          <FormControl>
                            <div className="relative">
                              {/* <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /> */}
                              <Input
                                className="pl-3"
                                placeholder="Eg: Officer"
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
                      name={"dob"}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>DOB</FormLabel>
                          <FormControl>
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              className="rounded-md border"
                              disabled={(date) => date > new Date()}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field: { onChange, value, ...field } }) => (
                      <FormItem>
                        <FormLabel>Profile Image *</FormLabel>
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
                                (PNG, JPG, JPEG - Max 1MB)
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

                                        // if (fileToDelete?.startsWith("http"))
                                        //   dispatch(
                                        //     deleteImage({
                                        //       id: singleCourse?.image?.id,
                                        //     })
                                        //   );
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
                onClick={() => navigate("/admins")}
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
                  <>Update</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
};

// Simple check icon component

export default AddBasicProfile;
