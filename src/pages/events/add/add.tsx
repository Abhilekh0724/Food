import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ArrowLeft, CalendarIcon, FileIcon, Loader2, UploadIcon, Users, XCircleIcon } from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { type EventFormData, eventSchema } from "../schema/event-form-schema"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useAuth } from "@/context/auth-context"
import { dispatch, useSelector } from "@/store/store"
import { createEvent, fetchSingleEvents, updateEvent } from "@/store/features/event-slice"
import { devLog } from "@/util/logger"

export default function AddEventPage({ isEdit = false }: { isEdit?: boolean }) {
  const { user } = useAuth()
  const { id } = useParams()

  const navigate = useNavigate()


  const [documentPreviews, setDocumentPreviews] = useState<string[]>([]);

  const singleEvent = useSelector((state) => state.event.singleEvent);
  const loading = useSelector((state) => state.event.isLoading);

  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchSingleEvents({
        id, params: {
          populate: 'address,featureImage,eventJoiners.user.bloodGroup'
        }
      }))
    }
  }, [id, isEdit])

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: "",
      description: "",
      eventDate: undefined,
      noOfParticipants: "",
      country: "",
      district: "",
      municipality: "",
      zipCode: "",
      streetAddress: "",
      city: "",
      wardNo: "",
    },
  })

  const onSubmit = (data: EventFormData) => {
    const formData = new FormData()

    let featureImage = data?.featureImage;

    // If avatar is an array of strings, set it to undefined
    if (
      Array.isArray(featureImage) &&
      featureImage.every((item) => typeof item === "string")
    ) {
      featureImage = undefined;
    }
    // If avatar is a FileList or an array of File objects
    else if (featureImage instanceof FileList || Array.isArray(featureImage)) {
      const validFiles = Array.from(featureImage).filter(
        (file) => !file.name.startsWith("http") // Keep only those files whose name does NOT start with "http"
      );

      // Convert valid files to FileList using DataTransfer
      const dataTransfer = new DataTransfer();
      validFiles.forEach((file) => dataTransfer.items.add(file));

      // If no valid files remain, set avatar to undefined
      featureImage = validFiles.length > 0 ? dataTransfer.files : undefined;
    }

    if (featureImage && featureImage.length > 0) {
      Array.from(featureImage).forEach((file) => {
        formData.append("files.featureImage", file);
      });
    }


    const eventData = {
      name: data.name,
      description: data.description,
      eventDateTime: data.eventDate,
      noOfParticipants: data.noOfParticipants,
      organizer: user?.organizerProfile?.id,
      address: {
        country: data.country,
        district: data.district,
        municipality: data.municipality,
        zipCode: data.zipCode,
        streetAddress: data.streetAddress,
        city: data.city,
        wardNo: data.wardNo,
      }
    }

    formData.append('data', JSON.stringify(eventData))

    dispatch(isEdit && id ? updateEvent({ data: formData, navigate, id: singleEvent?.id, actionBy: user?.id }) : createEvent({ data: formData, navigate, actionBy: user?.id }))


    // Handle form submission here
  }

  useEffect(() => {
    if (singleEvent && id && isEdit) {
      form.reset({
        name:
          singleEvent?.attributes?.name ||
          "",
        description:
          singleEvent?.attributes?.description || "",
        eventDate:
          new Date(
            singleEvent?.attributes?.eventDateTime
          ) || "",
        noOfParticipants:
          singleEvent?.attributes?.noOfParticipants || "",
        country:
          singleEvent?.attributes?.address?.country ||
          "",
        district:
          singleEvent?.attributes?.address?.district || "",
        municipality:
          singleEvent?.attributes?.address?.municipality || "",
        zipCode:
          singleEvent?.attributes?.address?.zipCode || "",
        streetAddress:
          singleEvent?.attributes?.address?.streetAddress || "",
        city:
          singleEvent?.attributes?.address?.city || "",
        wardNo:
          singleEvent?.attributes?.address?.wardNo || "",
        featureImage: (() => {
          const dataTransfer = new DataTransfer();
          if (
            singleEvent?.attributes?.featureImage?.data?.attributes?.url
          ) {
            const file = new File([], singleEvent?.attributes?.featureImage?.data?.attributes?.url);
            dataTransfer.items.add(file);
          }
          return dataTransfer.files;
        })(), // Ensure files default to empty
      });
    }
  }, [singleEvent, form, id, isEdit]);

  devLog(form.getValues())

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link to="/community/events">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Add New Event</h1>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/50">
              <CardTitle className="text-xl">Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {/* Name and Description Row */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <span>Name</span>
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter event name" className="h-11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <span>Description</span>
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter event description"
                        className="min-h-[120px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Combined Date and Time Picker */}
              <FormField
                control={form.control}
                name="eventDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      <span>Event Date & Time</span>
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "h-11 w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP p")
                            ) : (
                              <span>Select date and time</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                        <div className="p-3 border-t border-border">
                          <div className="flex items-center gap-2">
                            <Input
                              type="time"
                              className="w-full"
                              value={
                                field.value
                                  ? format(field.value, "HH:mm")
                                  : ""
                              }
                              onChange={(e) => {
                                const time = e.target.value
                                if (field.value && time) {
                                  const [hours, minutes] = time.split(":")
                                  const newDate = new Date(field.value)
                                  newDate.setHours(parseInt(hours, 10))
                                  newDate.setMinutes(parseInt(minutes, 10))
                                  field.onChange(newDate)
                                }
                              }}
                            />
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Participants */}
              <FormField
                control={form.control}
                name="noOfParticipants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <span>Number of Participants</span>
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter number of participants" className="h-11" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Maximum number of participants allowed for this event
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featureImage"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>
                      <span>Feature Image</span>
                      <span className="text-red-500">*</span>
                    </FormLabel>
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
                                    //     deleteAvatar({
                                    //       id: singleCourse?.featureImage?.id,
                                    //     })
                                    //   );
                                    // Remove from previews

                                    const updatedPreviews =
                                      documentPreviews.filter(
                                        (_, i) => i !== index
                                      );
                                    setDocumentPreviews(updatedPreviews);

                                    // Remove from featureImage files
                                    const currentFiles =
                                      form.getValues("featureImage");

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
                                                  type: `featureImage/${fileExtension}`,
                                                })
                                              );
                                            }
                                          }
                                        }
                                      );
                                      form.setValue(
                                        "featureImage",
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

          {/* Address Section */}
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/50">
              <CardTitle className="text-xl">Address Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
              {/* Country and District */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Country</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter country" className="h-11" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">District</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter district" className="h-11" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Municipality and Zip Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="municipality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Municipality</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter municipality" className="h-11" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Zip Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter zip code" className="h-11" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Street Address and City */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="streetAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter street address" className="h-11" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">City</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city" className="h-11" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Ward Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="wardNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Ward Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter ward number" className="h-11" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-4 pt-6 pb-8 px-6 border-t">
              <Button disabled={loading} type="button" variant="outline" asChild>
                <Link to="/community/events">Cancel</Link>
              </Button>
              <Button disabled={loading} type="submit" className="px-8">
                {loading ? <Loader2 className="animate-spin" /> : `${isEdit && id ? "Update" : "Create"} Event`}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div >
  )
}
