import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSelector } from "@/store/store";
import { Calendar, Clock, MapPin } from "lucide-react";
import moment from "moment";

export default function UnitInformation() {
  const singleBloodUnit = useSelector(state => state.bloodPouch.singleData)


  return <Card>
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        Blood Unit Information
        {singleBloodUnit?.attributes?.isUsed ? (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-4 py-1 rounded-full dark:bg-blue-900 dark:text-blue-300">
            Used
          </span>
        ) : singleBloodUnit?.attributes?.isWasted ? (
          <span className="bg-red-100 text-red-800 text-xs font-medium px-4 py-1 rounded-full dark:bg-red-900 dark:text-red-300">
            Wasted
          </span>
        ) : singleBloodUnit?.attributes?.bloodPouchRequests?.data?.some((bP: any) => bP?.attributes?.status === 'Approve' && bP?.attributes?.requestType === 'Transfer') ? (
          <span className="bg-purple-100 text-purple-800 text-xs font-medium px-4 py-1 rounded-full dark:bg-purple-900 dark:text-purple-300">
            Transferred
          </span>
        ) : (
          <span className="bg-green-100 text-green-800 text-xs font-medium px-4 py-1 rounded-full dark:bg-green-900 dark:text-green-300">
            Available
          </span>
        )}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Blood Group</label>
          <div className="flex items-center gap-2 mt-1">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-sm font-medium text-red-700">
              {singleBloodUnit?.attributes?.bloodGroup?.data?.attributes?.name}
            </div>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Blood Type</label>
          <p className="font-medium mt-1">{singleBloodUnit?.attributes?.bloodType}</p>
        </div>


        <div>
          <label className="text-sm font-medium text-muted-foreground">Collection Date</label>
          <div className="flex items-center gap-1 mt-1">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{moment(singleBloodUnit?.attributes?.donationDate).format("DD MMM, YYYY")}</span>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Expiration Date</label>
          <div className="flex items-center gap-1 mt-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{moment(singleBloodUnit?.attributes?.expiry).format("DD MMM, YYYY")}</span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
}
