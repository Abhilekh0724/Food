import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSelector } from "@/store/store";
import { CheckCircle } from "lucide-react";

export default function UsageInformation() {
  const singleBloodUnit = useSelector(state => state.bloodPouch.singleData);

  return (
    <div className="space-y-4">
      {singleBloodUnit?.attributes?.usedBy ? <Card>
        <CardHeader>
          <CardTitle>Recipient Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <p className="font-medium mt-1">
                {singleBloodUnit?.attributes?.usedBy?.firstName} {singleBloodUnit?.attributes?.usedBy?.lastName}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="font-medium mt-1">{singleBloodUnit?.attributes?.usedBy?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Phone</label>
              <p className="font-medium mt-1">{singleBloodUnit?.attributes?.usedBy?.phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Occupation</label>
              <p className="font-medium mt-1">{singleBloodUnit?.attributes?.usedBy?.occupation}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Address</label>
              <p className="font-medium mt-1">
                {singleBloodUnit?.attributes?.usedBy?.streetAddress}, {singleBloodUnit?.attributes?.usedBy?.wardNo}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Municipality</label>
              <p className="font-medium mt-1">{singleBloodUnit?.attributes?.usedBy?.municipality}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">District</label>
              <p className="font-medium mt-1">{singleBloodUnit?.attributes?.usedBy?.district}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Country</label>
              <p className="font-medium mt-1">{singleBloodUnit?.attributes?.usedBy?.country}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Zip Code</label>
              <p className="font-medium mt-1">{singleBloodUnit?.attributes?.usedBy?.zipCode}</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Used Purpose</label>
            <p className="font-medium mt-1">{singleBloodUnit?.attributes?.usedPurpose}</p>
          </div>
        </CardContent>
      </Card> : <div className="flex justify-center">No Usage Information</div>}
    </div>
  );
}
