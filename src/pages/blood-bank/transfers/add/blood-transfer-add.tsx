import DashboardBreadcrumb from "@/components/common/breadcrumb";
import Loader from "@/components/common/loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/auth-context";
import useDebounce from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import {
  createBloodTransferRequest,
  fetchSingleBloodTransfers,
  updateBloodTransferRequest,
} from "@/store/features/blood-transfer-slice";
import { fetchOrganizers } from "@/store/features/organizer-slice";
import { dispatch, useSelector } from "@/store/store";
import { devLog } from "@/util/logger";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  bloodTransferSchema,
  FormValues,
} from "../schema/blood-transfer-schema";

const AddBloodTransfer = ({ isEdit = false }: { isEdit?: boolean }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchLoading = useSelector((state) => state.bloodTransfer.fetchLoading);
  const loading = useSelector((state) => state.bloodPouch.isLoading);
  const singleTransfer = useSelector((state) => state.bloodTransfer.singleData);
  const bloodBanks = useSelector((state) => state.organizer.data);
  const bloodGroups = useSelector((state) => state.common.bloodGroups);
  const pouches = useSelector((state) => state.bloodPouch.data);

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPouches, setSelectedPouches] = useState<string[]>([]);
  const [unitAdjustmentMessage, setUnitAdjustmentMessage] = useState("");
  const debouncedValue = useDebounce(searchQuery, 1000);

  const [bGbT, setBgBt] = useState({
    bloodGroup: "",
    bloodType: "",
  });

  const [filteredBloodBanks, setFilteredBloodBanks] = useState(
    bloodBanks?.data || []
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(bloodTransferSchema),
    defaultValues: {
      purpose: "",
      bloodType: "",
      bloodGroup: "",
      requestType: "Transfer",
      noOfUnits: "",
      toOrganizer: "",
      fromOrganizer: user?.organizerProfile?.id?.toString(),
    },
  });

  useEffect(() => {
    if (id) {
      dispatch(
        fetchSingleBloodTransfers({
          id,
          params: {
            populate: "requestedBloodPouches, toOrganizer",
          },
        })
      );
    }
  }, [id]);

  useEffect(() => {
    const tempBank =
      bloodBanks?.data
        ?.filter((b) =>
          searchQuery !== ""
            ? b?.attributes?.name
                ?.toLowerCase()
                ?.includes(searchQuery.toLowerCase())
            : true
        )
        ?.map((d) => ({
          label: d?.attributes?.name,
          value: d?.id,
          units:
            d?.attributes?.bloodPouches?.data?.filter(
              (p: any) =>
                p?.attributes?.bloodGroup?.data?.id?.toString() ===
                  form.getValues("bloodGroup") &&
                p?.attributes?.bloodType === form.getValues("bloodType") &&
                !p?.attributes?.isUsed &&
                !p?.attributes?.isWasted &&
                new Date(p?.attributes?.expiry) > new Date()
            )?.length || 0,
        }))
        ?.sort((a, b) => b.units - a.units) || [];

    setFilteredBloodBanks(tempBank);
  }, [bloodBanks, searchQuery, form]);

  useEffect(() => {
    const noOfUnits = form.watch("noOfUnits");
    if (form.watch("bloodGroup") && form.watch("bloodType") && noOfUnits) {
      dispatch(
        fetchOrganizers({
          params: {
            pagination: {
              page: 1,
              pageSize: 1000,
            },
            filters: {
              bloodPouches: {
                bloodGroup: { id: form.watch("bloodGroup") },
                bloodType: form.watch("bloodType"),
                isUsed: false,
                isWasted: false,
                expiry: { $gt: new Date() },
                $and: [
                  { bloodGroup: { id: form.watch("bloodGroup") } },
                  { bloodType: form.watch("bloodType") },
                  {
                    $or: [
                      { bloodPouchRequests: { id: { $null: true } } }, // No request exists
                      {
                        bloodPouchRequests: {
                          status: { $eq: "Reject" }, // If request exists, status must be "Reject"
                        },
                      },
                    ],
                  },
                ],
              },
            },
            populate: "bloodPouches.bloodGroup,bloodPouches.bloodPouchRequests",
          },
        })
      );
    }
  }, [
    form,
    form.watch("noOfUnits"),
    form.watch("bloodType"),
    form.watch("bloodGroup"),
  ]);

  const handleBankSelection = (bankId: string) => {
    const selectedBank = filteredBloodBanks.find(
      (bank) => bank.value.toString() === bankId
    );

    if (selectedBank) {
      const availableUnits = selectedBank.units;
      const currentUnits = parseInt(form.getValues("noOfUnits") || "0");

      devLog(currentUnits, availableUnits, "hello wrold");
      if (currentUnits > availableUnits) {
        form.setValue("noOfUnits", availableUnits.toString());
        setUnitAdjustmentMessage(
          `Requested units adjusted to ${availableUnits} to match available units in the selected bank.`
        );

        toast.info(
          `Requested units adjusted to ${availableUnits} to match available units in the selected bank.`
        );
      } else if (currentUnits === 0) {
        form.setValue("noOfUnits", availableUnits.toString());
        setUnitAdjustmentMessage(
          `Requested units set to ${availableUnits} (available units in the selected bank).`
        );

        toast(
          `Requested units set to ${availableUnits} (available units in the selected bank).`
        );
      } else {
        setUnitAdjustmentMessage("");
      }
    }
  };

  const onSubmit = (data: FormValues) => {
    const selectedBank = filteredBloodBanks.find(
      (bank) => bank.value === data.toOrganizer
    );
    if (selectedBank && parseInt(data.noOfUnits) > selectedBank.units) {
      toast.warning(
        `The selected bank only has ${selectedBank.units} units available.`
      );
      return;
    }

    dispatch(
      isEdit && id
        ? updateBloodTransferRequest({ data, actionBy: user?.id, id })
        : createBloodTransferRequest({ data, navigate, actionBy: user?.id })
    );
  };

  useEffect(() => {
    if (singleTransfer && id) {
      form.reset({
        purpose: singleTransfer?.attributes?.purpose || "",
        noOfUnits: singleTransfer?.attributes?.noOfUnits || "",
        requestType: singleTransfer?.attributes?.requestType || "",
        toOrganizer:
          singleTransfer?.attributes?.toOrganizer?.data?.id?.toString() || "",
        fromOrganizer: user?.organizerProfile?.id?.toString() || "",
      });
    }
  }, [singleTransfer, form, id, user?.organizerProfile?.id]);

  const breadcrumbItems = [
    { label: "Blood Transfers", href: "/blood-transfers" },
    {
      label: "Add/Update Blood Transfers",
      href: `/blood-transfers/${singleTransfer?.id}`,
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
                      ? `Update Blood Transfer Info`
                      : "Request Blood Transfer"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="bloodType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Blood Type *</FormLabel>
                            <FormControl>
                              <Select
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
                                    { label: "Plasma", value: "Pasma" },
                                    {
                                      label: "Whole Blood",
                                      value: "Whole Blood",
                                    },
                                    {
                                      label: "Power Blood",
                                      value: "Power Blood",
                                    },
                                  ]?.map((bg, i) => (
                                    <SelectItem
                                      key={i}
                                      value={String(bg?.value)}
                                    >
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
                                    <SelectItem
                                      key={i}
                                      value={String(bg?.value)}
                                    >
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
                        name="noOfUnits"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Required Unit *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Units"
                                {...field}
                                type="number"
                                min="1"
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (
                                    value === "" ||
                                    /^[1-9]\d*$/.test(value)
                                  ) {
                                    field.onChange(value);
                                    setUnitAdjustmentMessage("");
                                    form.resetField("toOrganizer");
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  <FormField
                    control={form.control}
                    name="toOrganizer"
                    render={({ field }) => (
                      <FormItem className="flex flex-col flex-1">
                        <FormLabel>Request To *</FormLabel>
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
                                  {(field.value &&
                                    bloodBanks?.data
                                      ?.map((d) => ({
                                        label: d?.attributes?.name,
                                        value: d?.id?.toString(),
                                      }))
                                      .find(
                                        (option) => option.value === field.value
                                      )?.label) ||
                                    "Select blood bank..."}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="p-0" align="start">
                              <Command shouldFilter={false}>
                                <CommandInput
                                  placeholder="Search blood bank..."
                                  value={searchQuery}
                                  onValueChange={setSearchQuery}
                                />
                                <CommandEmpty>
                                  No blood banks found
                                </CommandEmpty>
                                <CommandGroup>
                                  {filteredBloodBanks?.map((option, index) => (
                                    <CommandItem
                                      key={index}
                                      value={option?.value?.toString()}
                                      onSelect={() => {
                                        form.setValue(
                                          "toOrganizer",
                                          option?.value?.toString()
                                        );
                                        handleBankSelection(
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
                                      {option.label} ({option.units} units)
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>
                        {unitAdjustmentMessage && (
                          <p className="text-sm text-muted-foreground mt-2 text-yellow-500 font-semibold">
                            ***{unitAdjustmentMessage}***
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <FormField
                    control={form.control}
                    name="purpose"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Purpose*</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Purpose" {...field} />
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
                onClick={() => navigate("/blood-transfers")}
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
                  "Update Transfer"
                ) : (
                  "Request Transfer"
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
};

export default AddBloodTransfer;
