import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateAdmin } from "@/store/features/admin-slice";
import { dispatch, useSelector } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { formSchema } from "../schema/address-schema";

type Address = {
  country: string;
  district: string;
  municipality: string;
  zipCode: string;
  streetAddress: string;
  city: string;
  wardNo: string;
};

type FormValues = {
  currentAddress: Address;
  permAddress: Address;
};

const AddAddressInfo = ({ isEdit }: { isEdit: boolean }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const loading = useSelector((state) => state.admin.isLoading);
  const singleAdmin = useSelector((state) => state.admin.singleData);

  const [sameAsCurrent, setSameAsCurrent] = useState(false);

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      currentAddress: {
        country: "",
        district: "",
        municipality: "",
        zipCode: "",
        streetAddress: "",
        city: "",
        wardNo: "",
      },
      permAddress: {
        country: "",
        district: "",
        municipality: "",
        zipCode: "",
        streetAddress: "",
        city: "",
        wardNo: "",
      },
    },
  });

  const { control, handleSubmit, getValues, setValue, reset } = methods;

  const addressFields: (keyof Address)[] = [
    "country",
    "district",
    "municipality",
    "zipCode",
    "streetAddress",
    "city",
    "wardNo",
  ];

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    dispatch(
      updateAdmin({ id: singleAdmin?.attributes?.user?.data?.id, data })
    );
  };

  useEffect(() => {
    if (singleAdmin && id) {
      reset({
        currentAddress: {
          country:
            singleAdmin?.attributes?.user?.data?.attributes?.currentAddress
              ?.country,
          district:
            singleAdmin?.attributes?.user?.data?.attributes?.currentAddress
              ?.district,
          municipality:
            singleAdmin?.attributes?.user?.data?.attributes?.currentAddress
              ?.municipality,
          zipCode:
            singleAdmin?.attributes?.user?.data?.attributes?.currentAddress
              ?.zipCode,
          streetAddress:
            singleAdmin?.attributes?.user?.data?.attributes?.currentAddress
              ?.streetAddress,
          city: singleAdmin?.attributes?.user?.data?.attributes?.currentAddress
            ?.city,
          wardNo:
            singleAdmin?.attributes?.user?.data?.attributes?.currentAddress
              ?.wardNo,
        },

        permAddress: {
          country:
            singleAdmin?.attributes?.user?.data?.attributes?.permAddress
              ?.country,
          district:
            singleAdmin?.attributes?.user?.data?.attributes?.permAddress
              ?.district,
          municipality:
            singleAdmin?.attributes?.user?.data?.attributes?.permAddress
              ?.municipality,
          zipCode:
            singleAdmin?.attributes?.user?.data?.attributes?.permAddress
              ?.zipCode,
          streetAddress:
            singleAdmin?.attributes?.user?.data?.attributes?.permAddress
              ?.streetAddress,
          city: singleAdmin?.attributes?.user?.data?.attributes?.permAddress
            ?.city,
          wardNo:
            singleAdmin?.attributes?.user?.data?.attributes?.permAddress
              ?.wardNo,
        },
      });
    }
  }, [singleAdmin, id, reset]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-5">
        <h2 className="text-xl font-semibold">Current Address</h2>
        <div className="grid grid-cols-2 gap-5">
          {addressFields.map((field) => (
            <FormField
              key={`currentAddress.${field}`}
              control={control}
              name={`currentAddress.${field}` as const}
              render={({ field: addressField }) => (
                <FormItem>
                  <FormLabel>
                    {field.charAt(0).toUpperCase() +
                      field.slice(1).replace(/([A-Z])/g, " $1")}{" "}
                    *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`Enter ${field}`}
                      {...addressField}
                      onChange={(e) => {
                        addressField.onChange(e);
                        if (sameAsCurrent) {
                          setValue(
                            `permAddress.${field}` as const,
                            e.target.value
                          );
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <div className="mt-4">
          <FormItem>
            <FormControl>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="sameAsCurrent"
                  checked={sameAsCurrent}
                  onCheckedChange={(checked) => {
                    setSameAsCurrent(!!checked);
                    if (checked) {
                      addressFields.forEach((field) => {
                        const value = getValues(
                          `currentAddress.${field}` as const
                        );
                        setValue(`permAddress.${field}` as const, value);
                      });
                    }
                  }}
                />
                <FormLabel htmlFor="sameAsCurrent">
                  Same as current address
                </FormLabel>
              </div>
            </FormControl>
          </FormItem>
        </div>

        <h2 className="text-xl font-semibold mt-6">Permanent Address</h2>

        <div className="grid grid-cols-2 gap-5">
          {addressFields.map((field) => (
            <FormField
              key={`permAddress.${field}`}
              control={control}
              name={`permAddress.${field}` as const}
              render={({ field: addressField }) => (
                <FormItem>
                  <FormLabel>
                    {field.charAt(0).toUpperCase() +
                      field.slice(1).replace(/([A-Z])/g, " $1")}{" "}
                    *
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={sameAsCurrent}
                      placeholder={`Enter ${field}`}
                      {...addressField}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
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
              <Button>
                {isEdit &&
                id &&
                singleAdmin?.data?.attributes?.user?.data?.attributes
                  ?.currentAddress
                  ? "Update"
                  : "Add"}{" "}
                Address
              </Button>
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default AddAddressInfo;
