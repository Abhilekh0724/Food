import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { devLog } from "@/util/logger";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format, set } from "date-fns";
import {
  CalendarIcon,
  CheckCircle2,
  ClockIcon,
  EyeIcon,
  EyeOffIcon,
  FileIcon,
  Lock,
  MailIcon,
  PhoneIcon,
  User,
} from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

const formSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
    dateOfBirth: z.date({
      required_error: "Date of birth is required",
    }),
    appointmentDateTime: z.date({
      required_error: "Appointment date and time is required",
    }),
    availabilityTime: z.object({
      from: z.date(),
      to: z.date(),
    }),
    contractDuration: z.object({
      from: z.date(),
      to: z.date(),
    }),
    documents: z
      .custom<FileList>()
      .refine(
        (files) => files?.length > 0,
        "Please upload at least one document"
      )
      .refine(
        (files) =>
          Array.from(files).every((file) => file.size <= 5 * 1024 * 1024),
        "Each file must be less than 5MB"
      ),
    imageUrl: z.string().url().optional(),
    profileImage: z
      .custom<FileList>()
      .refine((files) => files?.length === 1, "Please upload only one image")
      .refine(
        (files) =>
          files?.length === 0 ||
          Array.from(files).every(
            (file) =>
              file.type.startsWith("image/") && file.size <= 1 * 1024 * 1024
          ),
        "Image must be less than 1MB"
      )
      .optional(),
    status: z.enum(["active", "inactive", "pending"]),
    bio: z
      .string()
      .min(10, "Bio must be at least 10 characters")
      .max(500, "Bio must not exceed 500 characters"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
      ),
    confirmPassword: z.string(),
    experienceYears: z.number().min(0).max(50),
  })
  .refine((data: any) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

export default function AddCustomerPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 365),
  });
  const [timeRange, setTimeRange] = useState<DateRange>({
    from: set(new Date(), { hours: 9, minutes: 0 }),
    to: set(new Date(), { hours: 17, minutes: 0 }),
  });
  const [documentPreviews, setDocumentPreviews] = useState<string[]>([]);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      status: "active",
      bio: "",
      password: "",
      confirmPassword: "",
      experienceYears: 0,
      contractDuration: {
        from: new Date(),
        to: addDays(new Date(), 365),
      },
      availabilityTime: {
        from: set(new Date(), { hours: 9, minutes: 0 }),
        to: set(new Date(), { hours: 17, minutes: 0 }),
      },
      appointmentDateTime: new Date(),
      documents: new DataTransfer().files,
      imageUrl: "",
      profileImage: new DataTransfer().files,
    },
  });

  const onSubmit = (data: FormValues) => {
    devLog(data);
    navigate("/customers");
  };

  return (
    <Card className="w-full max-w-3xl mx-auto my-6 p-2 sm:p-6">
      <CardHeader>
        <CardTitle>Add New Customer</CardTitle>
        <CardDescription>
          Enter the customer details to create a new account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-9" placeholder="John" {...field} />
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
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-9" placeholder="Doe" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MailIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          className="pl-9"
                          placeholder="john@example.com"
                          type="email"
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
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <PhoneIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          className="pl-9"
                          placeholder="+1234567890"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }: any) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) =>
                            field.onChange(date || new Date())
                          }
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({
                  field,
                }: {
                  field: { onChange: (value: string) => void; value: string };
                }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">
                          <div className="flex items-center">
                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                            Active
                          </div>
                        </SelectItem>
                        <SelectItem value="inactive">
                          <div className="flex items-center">
                            <CheckCircle2 className="mr-2 h-4 w-4 text-gray-500" />
                            Inactive
                          </div>
                        </SelectItem>
                        <SelectItem value="pending">
                          <div className="flex items-center">
                            <CheckCircle2 className="mr-2 h-4 w-4 text-yellow-500" />
                            Pending
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="appointmentDateTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Appointment Date & Time</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP p")
                            ) : (
                              <span>Pick date and time</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <div className="p-4 space-y-4">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) =>
                              field.onChange(date || new Date())
                            }
                            initialFocus
                          />
                          <div className="grid gap-2">
                            <Label>Time</Label>
                            <Input
                              type="time"
                              onChange={(event) => {
                                const [hours, minutes] = event.target.value
                                  .split(":")
                                  .map(Number);
                                const newDate = set(field.value || new Date(), {
                                  hours,
                                  minutes,
                                });
                                field.onChange(newDate);
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

              <FormField
                control={form.control}
                name="availabilityTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Availability Time</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !timeRange && "text-muted-foreground"
                            )}
                          >
                            <ClockIcon className="mr-2 h-4 w-4" />
                            {timeRange?.from ? (
                              timeRange.to ? (
                                <>
                                  {format(timeRange.from, "p")} -{" "}
                                  {format(timeRange.to, "p")}
                                </>
                              ) : (
                                format(timeRange.from, "p")
                              )
                            ) : (
                              <span>Select availability time</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-96 p-4" align="start">
                        <div className="space-y-4">
                          <div className="grid gap-2">
                            <Label>Start Time</Label>
                            <Input
                              type="time"
                              value={format(
                                timeRange.from || new Date(),
                                "HH:mm"
                              )}
                              onChange={(event) => {
                                const newFrom = set(
                                  timeRange.to || new Date(),
                                  {
                                    hours: +event.target.value.split(":")[0],
                                    minutes: +event.target.value.split(":")[1],
                                  }
                                );
                                const newTimeRange = {
                                  ...timeRange,
                                  from: newFrom,
                                };

                                setTimeRange(newTimeRange);
                                field.onChange(event.target.value);
                              }}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label>End Time</Label>
                            <Input
                              type="time"
                              value={format(
                                timeRange.to || new Date(),
                                "HH:mm"
                              )}
                              onChange={(event) => {
                                const newTo = set(timeRange.to || new Date(), {
                                  hours: +event.target.value.split(":")[0],
                                  minutes: +event.target.value.split(":")[1],
                                });
                                const newTimeRange = {
                                  ...timeRange,
                                  to: newTo,
                                };

                                setTimeRange(newTimeRange);
                                field.onChange(event.target.value);
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contractDuration"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Contract Duration</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date?.from ? (
                              date.to ? (
                                <>
                                  {format(date.from, "LLL dd, y")} -{" "}
                                  {format(date.to, "LLL dd, y")}
                                </>
                              ) : (
                                format(date.from, "LLL dd, y")
                              )
                            ) : (
                              <span>Pick a date range</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={date?.from}
                          selected={date}
                          onSelect={(range) => {
                            setDate(range);
                            if (range?.from && range?.to) {
                              field.onChange(range);
                            }
                          }}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="documents"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Documents</FormLabel>
                    <FormControl>
                      <div className="grid w-full items-center gap-1.5">
                        <Input
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif,.bmp"
                          onChange={(e) => {
                            onChange(e.target.files);
                          }}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload relevant documents (PDF, DOC, DOCX, TXT - Max 5MB
                      each)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="experienceYears"
                render={({
                  field: { value, onChange },
                }: {
                  field: { value: number; onChange: (value: number) => void };
                }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Slider
                          min={0}
                          max={50}
                          step={1}
                          value={[value]}
                          onValueChange={(vals) => onChange(vals[0])}
                        />
                        <div className="text-sm text-muted-foreground text-center">
                          {value} years
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({
                  field,
                }: {
                  field: React.InputHTMLAttributes<HTMLTextAreaElement>;
                }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about the customer..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Brief description about the customer (max 500 characters)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Image URL</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Input
                          placeholder="https://example.com/image.jpg"
                          {...field}
                        />
                        {field.value && (
                          <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                            <img
                              src={field.value}
                              alt="Profile preview"
                              className="object-cover w-full h-full"
                              onError={(e) => {
                                e.currentTarget.src = "placeholder-image-url";
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="profileImage"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Time picker</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Input type="time" {...field} />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload a profile image (Max 2MB)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Image URL</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Input
                          placeholder="https://example.com/image.jpg"
                          {...field}
                        />
                        {field.value && (
                          <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                            <img
                              src={field.value}
                              alt="Profile preview"
                              className="object-cover w-full h-full"
                              onError={(e) => {
                                e.currentTarget.src = "placeholder-image-url";
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="profileImage"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Upload Profile Image</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            onChange(e.target.files);
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setProfilePreview(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          {...field}
                        />
                        {profilePreview && (
                          <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                            <img
                              src={profilePreview}
                              alt="Profile preview"
                              className="object-cover w-full h-full"
                            />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload a profile image (Max 2MB)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="documents"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Documents</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                        onChange={(e) => {
                          const files = e.target.files;
                          onChange(files);
                          if (files) {
                            const previews = Array.from(files).map((file) => {
                              if (file.type.startsWith("image/")) {
                                return URL.createObjectURL(file);
                              }
                              return `${file.name} (${(
                                file.size /
                                1024 /
                                1024
                              ).toFixed(2)}MB)`;
                            });
                            setDocumentPreviews(previews);
                          }
                        }}
                        {...field}
                      />
                      {documentPreviews.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {documentPreviews.map((preview, index) => (
                            <div key={index} className="relative">
                              {preview.startsWith("blob:") ? (
                                <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                                  <img
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                              ) : (
                                <div className="flex items-center justify-center w-24 h-24 bg-muted rounded-lg">
                                  <FileIcon className="w-8 h-8 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground mt-1">
                                    {preview}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload relevant documents (PDF, DOC, DOCX, Images - Max 5MB
                    each)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({
                  field,
                }: {
                  field: React.InputHTMLAttributes<HTMLInputElement>;
                }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          className="pl-9 pr-10"
                          type={showPassword ? "text" : "password"}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOffIcon className="h-4 w-4" />
                          ) : (
                            <EyeIcon className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Must contain at least 8 characters, one uppercase, one
                      lowercase, one number and one special character
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({
                  field,
                }: {
                  field: React.InputHTMLAttributes<HTMLInputElement>;
                }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          className="pl-9 pr-10"
                          type={showConfirmPassword ? "text" : "password"}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOffIcon className="h-4 w-4" />
                          ) : (
                            <EyeIcon className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/customers")}
              >
                Cancel
              </Button>
              <Button type="submit">Add Customer</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
