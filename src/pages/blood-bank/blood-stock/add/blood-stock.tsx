import DashboardBreadcrumb from "@/components/common/breadcrumb";
import Loader from "@/components/common/loader";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
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
import { useAuth } from "@/context/auth-context";
import useDebounce from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import {
  createBloodPouch,
  fetchSingleBloodPouches,
  updateBloodPouch,
} from "@/store/features/blood-pouch-slice";
import { fetchDonors } from "@/store/features/donor-slice";
import { dispatch, useSelector } from "@/store/store";
import { devLog } from "@/util/logger";
import { generateRandomString } from "@/util/random";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Check,
  ChevronsUpDown,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { bloodStockSchema, FormValues } from "../schema/blood-stock-schema";

interface ReceiverInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  district: string;
  occupation: string;
  country: string;
  municipality: string;
  city: string;
  streetAddress: string;
  zipCode: string;
  wardNo: string;
}

const ReceiverInfoForm = ({
  receiverInfo,
  onSave,
  onCancel,
  isSubmitting,
}: {
  receiverInfo?: ReceiverInfo;
  onSave: (data: ReceiverInfo) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}) => {
  devLog(receiverInfo, "receiverInfo");

  const [formData, setFormData] = useState<ReceiverInfo>(
    receiverInfo || {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      district: "",
      occupation: "",
      country: "",
      municipality: "",
      city: "",
      streetAddress: "",
      zipCode: "",
      wardNo: "",
    }
  );

  devLog(formData, "formData");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <DialogContent className="max-w-4xl">
      <DialogHeader>
        <DialogTitle>Receiver Information</DialogTitle>
        <DialogDescription>
          Details of the person who received this blood pouch
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name*</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name*</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone*</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="district">District*</Label>
          <Input
            id="district"
            name="district"
            value={formData.district}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="occupation">Occupation</Label>
          <Input
            id="occupation"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country*</Label>
          <Input
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="municipality">Municipality*</Label>
          <Input
            id="municipality"
            name="municipality"
            value={formData.municipality}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City*</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="streetAddress">Street Address*</Label>
          <Input
            id="streetAddress"
            name="streetAddress"
            value={formData.streetAddress}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zipCode">Zip Code</Label>
          <Input
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="wardNo">Ward No</Label>
          <Input
            id="wardNo"
            name="wardNo"
            value={formData.wardNo}
            onChange={handleChange}
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={() => onSave(formData)}
          disabled={
            !formData.firstName ||
            !formData.lastName ||
            !formData.phone ||
            isSubmitting
          }
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : "Save"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

const AddBloodStock = ({ isEdit = false }: { isEdit?: boolean }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchLoading = useSelector((state) => state.bloodPouch.fetchLoading);
  const loading = useSelector((state) => state.bloodPouch.isLoading);
  const singleStock = useSelector((state) => state.bloodPouch.singleData);
  const donors = useSelector((state) => state.donor.data);
  const bloodGroups = useSelector((state) => state.common.bloodGroups);

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showReceiverForm, setShowReceiverForm] = useState(false);
  const debouncedValue = useDebounce(searchQuery, 1000);

  useEffect(() => {
    if (id) {
      dispatch(
        fetchSingleBloodPouches({
          id,
          params: {
            populate: "donor.donorProfile, bloodGroup, usedBy",
          },
        })
      );
    }
  }, [id]);

  const form = useForm<FormValues & { isUsed: boolean; usedBy?: ReceiverInfo }>(
    {
      resolver: zodResolver(bloodStockSchema),
      defaultValues: {
        pouchId: generateRandomString({ length: 8 }).toString(),
        bloodType: "",
        bloodGroup: "",
        donor: "",
        donationDate: new Date(),
        expiry: new Date(),
        isUsed: false,
        usedBy: undefined,
      },
    }
  );

  useEffect(() => {
    if (singleStock && id) {
      const usedBy = singleStock?.attributes?.usedBy;
      const initialValues = {
        pouchId:
          singleStock?.attributes?.pouchId ||
          generateRandomString({ length: 8 }).toString(),
        bloodType: singleStock?.attributes?.bloodType || "",
        bloodGroup:
          singleStock?.attributes?.bloodGroup?.data?.id?.toString() || "",
        donor: singleStock?.attributes?.donor?.data?.id?.toString() || "",
        donationDate: singleStock?.attributes?.donationDate
          ? new Date(singleStock?.attributes?.donationDate)
          : new Date(),
        expiry: singleStock?.attributes?.expiry
          ? new Date(singleStock?.attributes?.expiry)
          : new Date(),
        isUsed: !!singleStock?.attributes?.isUsed,
        usedBy: usedBy
          ? {
              firstName: usedBy.firstName || "",
              lastName: usedBy.lastName || "",
              email: usedBy.email || "",
              phone: usedBy.phone || "",
              district: usedBy.district || "",
              occupation: usedBy.occupation || "",
              country: usedBy.country || "",
              municipality: usedBy.municipality || "",
              city: usedBy.city || "",
              streetAddress: usedBy.streetAddress || "",
              zipCode: usedBy.zipCode || "",
              wardNo: usedBy.wardNo || "",
            }
          : undefined,
      };

      form.reset(initialValues);
    }
  }, [singleStock, form, id]);

  const onSubmit = (
    data: FormValues & { isUsed: boolean; usedBy?: ReceiverInfo }
  ) => {
    const submitData = {
      ...data,
      isUsed: form.getValues("isUsed"),
      usedAt: form.getValues("isUsed") ? new Date().toISOString() : null,
      usedBy: form.getValues("isUsed") ? form.getValues("usedBy") : null,
    };

    devLog(
      submitData,
      form.getValues("usedBy"),
      form.getValues("isUsed"),
      "submitData"
    );

    dispatch(
      isEdit && id
        ? updateBloodPouch({
            data: submitData,
            actionBy: user?.id,
            id,
          })
        : createBloodPouch({
            data: {
              ...submitData,
              organizer: user?.organizerProfile?.id,
            },
            navigate,
            actionBy: user?.id,
          })
    );
  };

  useEffect(() => {
    if (debouncedValue !== "") {
      setIsSearching(true);
      dispatch(
        fetchDonors({
          setIsSearching,
          params: {
            filters: {
              organizer: {
                id: user?.organizerProfile?.id,
              },
              ...(debouncedValue !== "" && {
                $or: [
                  {
                    donor: {
                      username: {
                        $containsi: debouncedValue,
                      },
                    },
                  },
                  {
                    donor: {
                      email: {
                        $containsi: debouncedValue,
                      },
                    },
                  },
                  {
                    donor: {
                      phone: {
                        $containsi: debouncedValue,
                      },
                    },
                  },
                ],
              }),
            },
            populate: "donor.donorProfile",
          },
        })
      );
    }
  }, [debouncedValue, user?.organizerProfile?.id]);

  const breadcrumbItems = [
    { label: "Blood Stocks", href: "/blood-stocks" },
    {
      label: isEdit ? `Update Blood Stock` : "Add Blood Stock",
      href: `/blood-stocks/${id || "add"}`,
    },
  ];

  return (
    <>
      <div className="mb-6">
        <DashboardBreadcrumb items={breadcrumbItems} homeHref="/" />
      </div>
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
                      ? `Update Blood Stock Info of Pouch ${singleStock?.attributes?.pouchId}`
                      : "Add New Blood Stock Info"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* <FormField
                      control={form.control}
                      name="pouchId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pouch ID *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter pouch ID" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}
                    <FormField
                      control={form.control}
                      name="bloodType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Blood Type *</FormLabel>
                          <FormControl>
                            <Select
                              key={field.value}
                              onValueChange={field.onChange}
                              defaultValue={String(field.value)}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Blood Type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {[
                                  {
                                    label: "Plasma",
                                    value: "Pasma",
                                  },
                                  {
                                    label: "Whole Blood",
                                    value: "Whole Blood",
                                  },
                                  {
                                    label: "Power Blood",
                                    value: "Power Blood",
                                  },
                                ]?.map((bg, i) => (
                                  <SelectItem key={i} value={String(bg?.value)}>
                                    {bg?.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bloodGroup"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Blood Group *</FormLabel>
                          <FormControl>
                            <Select
                              key={field.value}
                              onValueChange={field.onChange}
                              defaultValue={String(field.value)}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Blood Group" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {bloodGroups?.map((bg, i) => (
                                  <SelectItem key={i} value={String(bg?.value)}>
                                    {bg?.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-end w-full gap-3">
                      <FormField
                        control={form.control}
                        name="donor"
                        render={({ field }) => (
                          <FormItem className="flex flex-col flex-1">
                            <FormLabel>Donor</FormLabel>
                            <div className="relative">
                              <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      role="combobox"
                                      aria-expanded={open}
                                      className="w-full justify-between"
                                    >
                                      {field.value &&
                                      donors?.data
                                        ?.map((d) => ({
                                          label:
                                            d?.attributes?.donor?.data
                                              ?.attributes?.username,
                                          value:
                                            d?.attributes?.donor?.data?.id?.toString(),
                                        }))
                                        .find(
                                          (option) =>
                                            option.value === field.value
                                        )?.label
                                        ? donors?.data
                                            ?.map((d) => ({
                                              label:
                                                d?.attributes?.donor?.data
                                                  ?.attributes?.username,
                                              value:
                                                d?.attributes?.donor?.data?.id?.toString(),
                                            }))
                                            .find(
                                              (option) =>
                                                option.value === field.value
                                            )?.label || "Select donor..."
                                        : singleStock?.attributes?.donor?.data
                                            ?.attributes?.username
                                        ? singleStock?.attributes?.donor?.data
                                            ?.attributes?.username
                                        : "Select donor..."}
                                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="p-0"
                                  align="start"
                                  style={{
                                    width: "var(--radix-popover-trigger-width)",
                                  }}
                                >
                                  <Command shouldFilter={false}>
                                    <CommandInput
                                      placeholder="Search donor..."
                                      value={searchQuery}
                                      onValueChange={setSearchQuery}
                                    />
                                    {isSearching ? (
                                      <CommandEmpty>Searching...</CommandEmpty>
                                    ) : (
                                      <CommandEmpty>
                                        No donors found
                                      </CommandEmpty>
                                    )}
                                    <CommandGroup>
                                      {donors?.data
                                        ?.map((d) => ({
                                          label: `${d?.attributes?.donor?.data?.attributes?.username} (${d?.attributes?.donor?.data?.attributes?.donorProfile?.data?.attributes?.donorId})`,
                                          value: d?.attributes?.donor?.data?.id,
                                        }))
                                        ?.map((option, index) => (
                                          <CommandItem
                                            key={index}
                                            value={option.value.toString()}
                                            onSelect={() => {
                                              form.setValue(
                                                "donor",
                                                option.value.toString()
                                              );
                                              setOpen(false);
                                              setSearchQuery("");
                                            }}
                                          >
                                            <Check
                                              className={cn(
                                                "mr-2 h-4 w-4",
                                                field.value === option.value
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                            />
                                            {option.label}
                                          </CommandItem>
                                        ))}
                                    </CommandGroup>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <a
                        href="http://localhost:3000/members/add"
                        target="__blank"
                      >
                        <Button
                          type="button"
                          className="right-2 top-2 text-white px-2 py-1 rounded"
                          size="sm"
                        >
                          Add New
                        </Button>
                      </a>
                    </div>

                    <FormField
                      control={form.control}
                      name="donationDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Donation Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date > new Date()}
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
                      name="expiry"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Expiry Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
              <Button
                disabled={loading}
                type="button"
                variant="outline"
                onClick={() => navigate("/blood-stocks")}
              >
                Cancel
              </Button>
              <Button disabled={loading} type="submit">
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Please wait
                  </>
                ) : isEdit ? (
                  "Update Stock"
                ) : (
                  "Save Stock"
                )}
              </Button>
            </div>

            <Dialog open={showReceiverForm} onOpenChange={setShowReceiverForm}>
              <DialogTrigger asChild />
              <ReceiverInfoForm
                receiverInfo={
                  form.watch("usedBy") || singleStock?.attributes?.usedBy
                }
                onSave={(data) => {
                  form.setValue("usedBy", data);
                  setShowReceiverForm(false);
                }}
                onCancel={() => setShowReceiverForm(false)}
                isSubmitting={loading || false}
              />
            </Dialog>
          </form>
        </Form>
      )}
    </>
  );
};

export default AddBloodStock;
