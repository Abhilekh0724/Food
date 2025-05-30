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
import { Switch } from "@/components/ui/switch";
import { fetchSingleAdmins } from "@/store/features/admin-slice";
import { dispatch, useSelector } from "@/store/store";
import { devLog } from "@/util/logger";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileIcon, Loader2, UploadIcon, XCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { donorSchema, FormValues } from "../schema/donor-schema";

const AddDonorInfo = ({ isEdit = false }: { isEdit?: boolean }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [documentPreviews, setDocumentPreviews] = useState<string[]>([]);

  const fetchLoading = useSelector((state) => state.admin.fetchLoading);
  const loading = useSelector((state) => state.admin.isLoading);
  const singleAdmin = useSelector((state) => state.admin.singleData);

  const form = useForm<FormValues>({
    resolver: zodResolver(donorSchema),
    defaultValues: {
      weight: "",
      height: "",
      lastDonationDate: new Date(),
      everReceivedBlood: false,
      donatedBloodBefore: false,
      victimOfAnyDisease: false,
      hadVaccinationLast3Month: false,
      receiveDirectCall: false,
      receiveDirectMessage: false,
    },
  });

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

  const onSubmit = (data: FormValues) => {
    devLog("dataaa", data);
  };

  useEffect(() => {
    if (singleAdmin && id) {
      form.reset({
        height: singleAdmin?.height || "",
        weight: singleAdmin?.weight || "",
        lastDonationDate: singleAdmin?.lastDonationDate
          ? new Date(singleAdmin.lastDonationDate)
          : new Date(),
        everReceivedBlood: singleAdmin?.everReceivedBlood || false,
        donatedBloodBefore: singleAdmin?.donatedBloodBefore || false,
        victimOfAnyDisease: singleAdmin?.victimOfAnyDisease || false,
        hadVaccinationLast3Month:
          singleAdmin?.hadVaccinationLast3Month || false,
        receiveDirectCall: singleAdmin?.receiveDirectCall || false,
        receiveDirectMessage: singleAdmin?.receiveDirectMessage || false,
      });
    }
  }, [singleAdmin, form, id]);

  const questionnaireFields = [
    { name: "everReceivedBlood", label: "Have you ever received blood?" },
    { name: "donatedBloodBefore", label: "Have you donated blood before?" },
    {
      name: "victimOfAnyDisease",
      label: "Have you been a victim of any disease?",
    },
    {
      name: "hadVaccinationLast3Month",
      label: "Had any vaccination in last 3 months?",
    },
    { name: "receiveDirectCall", label: "Consent to receive direct calls?" },
    {
      name: "receiveDirectMessage",
      label: "Consent to receive direct messages?",
    },
  ];

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
                      ? `Update Donor Info of ${singleAdmin?.studentName}`
                      : "Add Donor Info of Admin"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height (cm) *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Eg: 160"
                              {...field}
                              onChange={(e) => {
                                const value = Math.max(
                                  0,
                                  Number(e.target.value)
                                );
                                field.onChange(value.toString());
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight (kg) *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Eg: 70"
                              {...field}
                              onChange={(e) => {
                                const value = Math.max(
                                  0,
                                  Number(e.target.value)
                                );
                                field.onChange(value.toString());
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastDonationDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Donation Date</FormLabel>
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

                  {/* Questionnaire Section */}
                  <div className="mt-8 space-y-4">
                    <h3 className="text-lg font-semibold">
                      Medical Questionnaire
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {questionnaireFields.map((item) => (
                        <FormField
                          key={item.name}
                          control={form.control}
                          name={item.name as keyof FormValues}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2">
                              <FormLabel className="text-base">
                                {item.label}
                              </FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value as boolean}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="attachments"
                    render={({ field: { onChange, value, ...field } }) => (
                      <FormItem>
                        <FormLabel>Attachments *</FormLabel>
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
                              multiple={true}
                              id="file-upload"
                              type="file"
                              className="hidden"
                              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif,.bmp"
                              onChange={(e) => {
                                const files = e.target.files;
                                const newFiles = new DataTransfer();

                                if (files) {
                                  const previousFiles =
                                    form.getValues("attachments");
                                  if (previousFiles) {
                                    Array.from(previousFiles).forEach(
                                      (file) => {
                                        if (file instanceof File) {
                                          newFiles.items.add(file); // Retain previous File objects
                                        }
                                      }
                                    );
                                  }

                                  Array.from(files).forEach((file) => {
                                    if (file instanceof File) {
                                      newFiles.items.add(file); // Add new File objects
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

                                  setDocumentPreviews((prev) => [
                                    ...prev,
                                    ...previews,
                                  ]);
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
                                          form.getValues("attachments");

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
                                            "attachments",
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
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Please wait
                  </>
                ) : (
                  "Update"
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
};

export default AddDonorInfo;
