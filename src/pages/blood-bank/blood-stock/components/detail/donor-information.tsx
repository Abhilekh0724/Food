import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getDonationCount } from "@/store/features/donor-slice";
import { dispatch, useSelector } from "@/store/store";
import { devLog } from "@/util/logger";
import { User } from "lucide-react";
import moment from "moment";
import { useEffect } from "react";

export default function DonorInformation() {
  const singleBloodUnit = useSelector(state => state.bloodPouch.singleData)
  const donationCount = useSelector(state => state.donor.donationCount)



  useEffect(() => {
    dispatch(getDonationCount({
      params: {
        filters: {
          acceptor: {
            id: singleBloodUnit?.attributes?.donor?.data?.id
          },
          status: "Donated"
        }
      }
    }))
  }, [])


  return <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <User className="h-5 w-5" />
        Donor Information
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Donor ID</label>
          <p className="font-medium mt-1">{singleBloodUnit?.attributes?.donor?.data?.attributes?.donorProfile?.data?.attributes?.donorId}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Full Name</label>
          <p className="font-medium mt-1">{`${singleBloodUnit?.attributes?.donor?.data?.attributes?.firstName} ${singleBloodUnit?.attributes?.donor?.data?.attributes?.lastName}`}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Age</label>
          <p className="font-medium mt-1">{moment().diff(moment(singleBloodUnit?.attributes?.donor?.data?.attributes?.dob), 'years')} years</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Gender</label>
          <p className="font-medium mt-1">{singleBloodUnit?.attributes?.donor?.data?.attributes?.gender}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Blood Group</label>
          <p className="font-medium mt-1">{singleBloodUnit?.attributes?.donor?.data?.attributes?.donorProfile?.data?.attributes?.bloodGroup?.data?.attributes?.name}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Total Donations</label>
          <p className="font-medium mt-1">{donationCount}</p>
        </div>
      </div>
      <Separator />
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground font-bold">Contact Information</label>
        <div className="space-y-1">
          <p className="text-sm">{singleBloodUnit?.attributes?.donor?.data?.attributes?.phone}</p>
          <p className="text-sm">{singleBloodUnit?.attributes?.donor?.data?.attributes?.email}</p>
          <p className="text-sm">{singleBloodUnit?.attributes?.donor?.data?.attributes?.currentAddress?.wardNo}-{singleBloodUnit?.attributes?.donor?.data?.attributes?.currentAddress?.city}, {singleBloodUnit?.attributes?.donor?.data?.attributes?.currentAddress?.district}</p>
        </div>
      </div>
    </CardContent>
  </Card>
}
