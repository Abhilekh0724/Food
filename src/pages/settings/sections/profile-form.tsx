
import type React from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/auth-context"
import { updateMe, updateOrganizerProfile } from "@/store/features/auth-slice"
import { dispatch, useSelector } from "@/store/store"
import { Loader2, Upload, Building2 } from "lucide-react"
import { profileFormSchema, type ProfileFormValues } from "../schema/schema"
import { devLog } from "@/util/logger"

// Updated default values for organization profile
const defaultValues: Partial<ProfileFormValues> = {
  organizationName: "",
  organizationType: "",
  description: "",
  phoneNumber: "",
  emailAddress: "",
  country: "",
  district: "",
  municipality: "",
  zipCode: "",
  streetAddress: "",
  city: "",
  wardNo: "",
  logo: undefined,
}

export function ProfileForm() {
  const { user, updateUser } = useAuth()
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const isLoading = useSelector((state) => state.auth.isLoading)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  })

  function onSubmit(data: ProfileFormValues) {
    const formData = new FormData()
    const profileData = {
      name: data.organizationName,
      description: data.description,
      phoneNumber: data.phoneNumber,
      contactEmail: data.emailAddress,
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
    if (data.logo) {
      formData.append('files.avatar', data.logo)
    }
    formData.append('data', JSON.stringify(profileData))
    dispatch(updateOrganizerProfile({ data: formData, id: user?.organizerProfile?.id }));
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      form.setValue("logo", file)
    }
  }

  useEffect(() => {
    form.reset({
      organizationName: user?.organizerProfile?.name || "",
      organizationType: user?.organizerProfile?.type || "",
      description: user?.organizerProfile?.description || "",
      phoneNumber: user?.organizerProfile?.phoneNumber || "",
      emailAddress: user?.organizerProfile?.contactEmail || "",
      country:
        user?.organizerProfile?.address?.country ||
        "",
      district:
        user?.organizerProfile?.address?.district || "",
      municipality:
        user?.organizerProfile?.address?.municipality || "",
      zipCode:
        user?.organizerProfile?.address?.zipCode || "",
      streetAddress:
        user?.organizerProfile?.address?.streetAddress || "",
      city:
        user?.organizerProfile?.address?.city || "",
      wardNo:
        user?.organizerProfile?.address?.wardNo || "",
    })
  }, [form, user])

  return (
    <div>


      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="">
            <CardContent className="pt-6 space-y-8">
              {/* Logo Upload Section */}
              <div className="flex items-start gap-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={logoPreview || user?.organizerProfile?.avatar?.url} alt="Organization logo" />
                    <AvatarFallback className="bg-muted">
                      <Building2 className="h-8 w-8 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>

                  <FormField
                    control={form.control}
                    name="logo"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="space-y-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleLogoUpload}
                              className="hidden"
                              id="logo-upload"
                            />
                            <label htmlFor="logo-upload">
                              <Button type="button" variant="outline" size="sm" className="cursor-pointer" asChild>
                                <span className="flex items-center gap-2">
                                  <Upload className="h-4 w-4" />
                                  Upload Logo
                                </span>
                              </Button>
                            </label>
                            <p className="text-xs text-muted-foreground text-center">
                              Recommended: 200×200px, PNG or JPG
                            </p>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="organizationName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Organization Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Red Cross Community Center" className="h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Description */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="A community-focused organization dedicated to organizing blood donation drives and supporting local healthcare initiatives."
                              className="min-h-[100px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Phone Number and Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 123-4567" className="h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="emailAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="contact@redcross.org" type="email" className="h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-4">
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
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-start">
                <Button type="submit" disabled={isLoading} className="bg-red-500 hover:bg-red-600 text-white px-8">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}
